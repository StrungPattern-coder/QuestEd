/**
 * Certificate and Badge Generator
 * Creates downloadable certificates and achievement badges using HTML Canvas
 */

interface CertificateData {
  playerName: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: Date;
  placement?: 1 | 2 | 3;
}

interface BadgeData {
  type: "1st" | "2nd" | "3rd" | "participation" | "perfect" | "streak";
  playerName: string;
  details?: string;
}

/**
 * Generate a certificate as a downloadable image
 */
export async function generateCertificate(
  data: CertificateData
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 850;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#667eea");
  gradient.addColorStop(1, "#764ba2");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border frame
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 20;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  // Inner border
  ctx.strokeStyle = "#f7fafc";
  ctx.lineWidth = 5;
  ctx.strokeRect(70, 70, canvas.width - 140, canvas.height - 140);

  // Decorative corners
  drawCornerDecoration(ctx, 100, 100, 1);
  drawCornerDecoration(ctx, canvas.width - 100, 100, -1);
  drawCornerDecoration(ctx, 100, canvas.height - 100, 1);
  drawCornerDecoration(ctx, canvas.width - 100, canvas.height - 100, -1);

  // Certificate title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px serif";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICATE", canvas.width / 2, 180);

  // Subtitle
  ctx.font = "italic 32px serif";
  ctx.fillText("of Achievement", canvas.width / 2, 230);

  // Divider line
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 270);
  ctx.lineTo(900, 270);
  ctx.stroke();

  // "This certifies that"
  ctx.font = "24px sans-serif";
  ctx.fillText("This certifies that", canvas.width / 2, 330);

  // Player name (prominent)
  ctx.fillStyle = "#FFD700"; // Gold
  ctx.font = "bold 56px serif";
  ctx.fillText(data.playerName, canvas.width / 2, 400);

  // Achievement text
  ctx.fillStyle = "#ffffff";
  ctx.font = "24px sans-serif";
  ctx.fillText("has successfully completed", canvas.width / 2, 460);

  // Quiz title
  ctx.font = "bold 36px sans-serif";
  const maxTitleWidth = 800;
  let quizTitle = data.quizTitle;
  ctx.font = "bold 36px sans-serif";
  if (ctx.measureText(quizTitle).width > maxTitleWidth) {
    ctx.font = "bold 28px sans-serif";
  }
  ctx.fillText(quizTitle, canvas.width / 2, 520);

  // Score details
  ctx.font = "28px sans-serif";
  const scoreText = `with a score of ${data.score}/${data.totalQuestions} (${data.percentage}%)`;
  ctx.fillText(scoreText, canvas.width / 2, 580);

  // Placement badge if applicable
  if (data.placement && data.placement <= 3) {
    const medals = {
      1: { emoji: "🥇", text: "1st Place", color: "#FFD700" },
      2: { emoji: "🥈", text: "2nd Place", color: "#C0C0C0" },
      3: { emoji: "🥉", text: "3rd Place", color: "#CD7F32" },
    };
    const medal = medals[data.placement];

    ctx.font = "48px sans-serif";
    ctx.fillText(medal.emoji, canvas.width / 2, 650);

    ctx.fillStyle = medal.color;
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(medal.text, canvas.width / 2, 700);
  }

  // Date
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  const dateStr = data.date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.fillText(dateStr, canvas.width / 2, canvas.height - 100);

  // QuestEd branding
  ctx.font = "italic 18px sans-serif";
  ctx.fillStyle = "#f7fafc";
  ctx.fillText("Powered by QuestEd", canvas.width / 2, canvas.height - 60);

  return canvas.toDataURL("image/png");
}

/**
 * Draw decorative corner elements
 */
function drawCornerDecoration(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number
) {
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 3;

  // Draw decorative flourish
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + scale * 30, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + scale * 30);
  ctx.stroke();
}

/**
 * Generate a badge as a downloadable image
 */
export async function generateBadge(data: BadgeData): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  // Badge configurations
  const badges = {
    "1st": {
      color: "#FFD700",
      emoji: "🥇",
      title: "1st Place",
      subtitle: "Gold Medal",
    },
    "2nd": {
      color: "#C0C0C0",
      emoji: "🥈",
      title: "2nd Place",
      subtitle: "Silver Medal",
    },
    "3rd": {
      color: "#CD7F32",
      emoji: "🥉",
      title: "3rd Place",
      subtitle: "Bronze Medal",
    },
    participation: {
      color: "#667eea",
      emoji: "🎯",
      title: "Participant",
      subtitle: "Well Done!",
    },
    perfect: {
      color: "#48bb78",
      emoji: "⭐",
      title: "Perfect Score",
      subtitle: "100% Accuracy",
    },
    streak: {
      color: "#f56565",
      emoji: "🔥",
      title: "Hot Streak",
      subtitle: "On Fire!",
    },
  };

  const badge = badges[data.type];

  // Background circle with gradient
  const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 300);
  gradient.addColorStop(0, badge.color);
  gradient.addColorStop(1, shadeColor(badge.color, -40));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(300, 300, 280, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 15;
  ctx.beginPath();
  ctx.arc(300, 300, 280, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.strokeStyle = shadeColor(badge.color, -60);
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(300, 300, 250, 0, Math.PI * 2);
  ctx.stroke();

  // Stars decoration
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const x = 300 + Math.cos(angle) * 220;
    const y = 300 + Math.sin(angle) * 220;
    drawStar(ctx, x, y, 5, 15, 7, "#FFD700");
  }

  // Emoji
  ctx.font = "120px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badge.emoji, 300, 260);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px sans-serif";
  ctx.fillText(badge.title, 300, 370);

  // Subtitle
  ctx.font = "28px sans-serif";
  ctx.fillText(badge.subtitle, 300, 420);

  // Player name
  ctx.font = "24px sans-serif";
  const maxNameWidth = 400;
  let name = data.playerName;
  if (ctx.measureText(name).width > maxNameWidth) {
    ctx.font = "20px sans-serif";
  }
  ctx.fillText(name, 300, 480);

  // Details if provided
  if (data.details) {
    ctx.font = "italic 18px sans-serif";
    ctx.fillStyle = "#f7fafc";
    ctx.fillText(data.details, 300, 520);
  }

  return canvas.toDataURL("image/png");
}

/**
 * Draw a star shape
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
  color: string
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Lighten or darken a hex color
 */
function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

/**
 * Download an image data URL as a file
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Generate and download certificate
 */
export async function downloadCertificate(data: CertificateData) {
  const imageData = await generateCertificate(data);
  const filename = `QuestEd_Certificate_${data.playerName.replace(/\s+/g, "_")}_${Date.now()}.png`;
  downloadImage(imageData, filename);
}

/**
 * Generate and download badge
 */
export async function downloadBadge(data: BadgeData) {
  const imageData = await generateBadge(data);
  const filename = `QuestEd_Badge_${data.type}_${data.playerName.replace(/\s+/g, "_")}_${Date.now()}.png`;
  downloadImage(imageData, filename);
}
