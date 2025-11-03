import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import Classroom from '@/backend/models/Classroom';
import User from '@/backend/models/User';
import { MicrosoftGraphClient, refreshAccessToken } from '@/backend/utils/microsoftGraph';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * POST /api/teams/sync
 * Sync Microsoft Teams classes, students, and assignments into QuestEd
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Authenticate user
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    // Get Teams integration
    const integration = await TeamsIntegration.findOne({ 
      userId, 
      isActive: true 
    });

    if (!integration) {
      return NextResponse.json({ error: 'Microsoft Teams not connected' }, { status: 400 });
    }

    // Check if token needs refresh
    if (integration.isTokenExpired()) {
      try {
        const newTokens = await refreshAccessToken(integration.refreshToken);
        integration.accessToken = newTokens.access_token;
        integration.refreshToken = newTokens.refresh_token;
        integration.tokenExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000);
        await integration.save();
      } catch (error) {
        return NextResponse.json({ 
          error: 'Token refresh failed. Please reconnect Microsoft Teams.' 
        }, { status: 401 });
      }
    }

    // Create Graph API client
    const graphClient = new MicrosoftGraphClient(integration.accessToken);

    // Get all education classes from Teams
    const teamsClasses = await graphClient.getEducationClasses();

    const syncResults = {
      classroomsCreated: 0,
      classroomsUpdated: 0,
      studentsAdded: 0,
      teachersAdded: 0,
      errors: [] as string[],
    };

    // Get the current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sync each Teams class to QuestEd
    for (const teamsClass of teamsClasses) {
      try {
        // Check if classroom already exists (by Microsoft Teams ID)
        let classroom = await Classroom.findOne({ 
          microsoftTeamsId: teamsClass.id 
        });

        // Separate members by role
        const owners = teamsClass.members.filter(m => m.roles.includes('owner'));
        const students = teamsClass.members.filter(m => !m.roles.includes('owner'));

        if (classroom) {
          // Update existing classroom
          classroom.name = teamsClass.displayName;
          classroom.description = teamsClass.description || '';
          
          // Add new students who aren't already in the classroom
          for (const student of students) {
            // Check if student exists in QuestEd
            let studentUser = await User.findOne({ email: student.email });
            
            if (!studentUser) {
              // Create student account
              studentUser = await User.create({
                name: student.displayName,
                email: student.email,
                password: Math.random().toString(36).slice(-12), // Temporary password
                role: 'student',
                microsoftUserId: student.userId,
                needsPasswordReset: true,
              });
              syncResults.studentsAdded++;
            }

            // Add to classroom if not already there
            const studentObjectId = studentUser._id as mongoose.Types.ObjectId;
            if (!classroom.students.some(id => id.equals(studentObjectId))) {
              classroom.students.push(studentObjectId);
            }
          }

          await classroom.save();
          syncResults.classroomsUpdated++;
        } else {
          // Create new classroom
          const studentIds = [];

          // Process students
          for (const student of students) {
            let studentUser = await User.findOne({ email: student.email });
            
            if (!studentUser) {
              studentUser = await User.create({
                name: student.displayName,
                email: student.email,
                password: Math.random().toString(36).slice(-12),
                role: 'student',
                microsoftUserId: student.userId,
                needsPasswordReset: true,
              });
              syncResults.studentsAdded++;
            }

            studentIds.push(studentUser._id);
          }

          // Create classroom
          classroom = await Classroom.create({
            name: teamsClass.displayName,
            description: teamsClass.description || `Synced from Microsoft Teams: ${teamsClass.displayName}`,
            teacher: userId,
            students: studentIds,
            joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            microsoftTeamsId: teamsClass.id,
            microsoftTeamsWebUrl: teamsClass.webUrl,
            syncedFromMicrosoft: true,
            lastSyncedAt: new Date(),
          });

          syncResults.classroomsCreated++;
        }

        // Get assignments for this class (if available)
        try {
          const assignments = await graphClient.getClassAssignments(teamsClass.id);
          
          // Store assignments metadata in classroom
          if (assignments.length > 0) {
            classroom.microsoftAssignments = assignments.map(a => ({
              id: a.id,
              displayName: a.displayName,
              dueDateTime: a.dueDateTime,
              status: a.status,
            }));
            await classroom.save();
          }
        } catch (error) {
          // Assignments endpoint might not be available for all account types
          console.log('Could not fetch assignments for class:', teamsClass.displayName);
        }

      } catch (error: any) {
        console.error(`Error syncing class ${teamsClass.displayName}:`, error);
        syncResults.errors.push(`${teamsClass.displayName}: ${error.message}`);
      }
    }

    // Update last sync time
    integration.lastSyncAt = new Date();
    await integration.save();

    return NextResponse.json({
      success: true,
      message: 'Successfully synced Microsoft Teams data',
      results: syncResults,
      totalClasses: teamsClasses.length,
    });

  } catch (error: any) {
    console.error('Error syncing Teams data:', error);
    return NextResponse.json({ 
      error: 'Failed to sync Teams data',
      details: error.message 
    }, { status: 500 });
  }
}
