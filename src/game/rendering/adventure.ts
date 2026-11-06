import type { GameEngine } from '../GameEngine.ts';
import { drawTrap } from './traps.ts';

export function renderAdventure(ctx: CanvasRenderingContext2D, game: GameEngine, time: number) {
  ctx.save();
  for (const trap of game.currentLevel.traps ?? []) drawTrap(ctx, trap, time, game.showHints);
  if (game.legTimeRemaining !== null) {
    game.currentLevel.plates.forEach((plate, index) => {
      const current = index === game.checkpointIndex;
      const visited = index < game.checkpointIndex;
      const cx = plate.x + plate.width/2, cy = plate.y - 20;
      ctx.beginPath(); ctx.arc(cx,cy,13,0,Math.PI*2);
      ctx.fillStyle = current ? '#dfbe80' : '#172920'; ctx.fill();
      ctx.strokeStyle = visited ? '#8bd8b4' : '#dfbe80'; ctx.lineWidth = current ? 3 : 1; ctx.stroke();
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = current ? '#18281f' : '#e3d8b8';
      ctx.fillText(visited ? '✓' : `${index+1}`,cx,cy+4);
      if (current) {
        ctx.strokeStyle = '#f3d79b'; ctx.setLineDash([6,5]); ctx.strokeRect(plate.x-8,plate.y-8,plate.width+16,plate.height+16); ctx.setLineDash([]);
      }
    });
    if (game.slowed) {
      ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#c1e28b';
      ctx.fillText('CHẬM 45%',game.player.x,game.player.y-40);
    }
  }
  for (const hazard of game.currentLevel.hazards ?? []) {
    const beat = (time + hazard.offset) % hazard.period;
    const active = beat < 0.9;
    ctx.beginPath(); ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
    ctx.fillStyle = active ? 'rgba(244,96,80,.36)' : 'rgba(235,170,104,.08)';
    ctx.strokeStyle = active ? '#fb8b75' : '#a77f58'; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
    ctx.beginPath();
    ctx.arc(hazard.x, hazard.y, hazard.radius + 5, -Math.PI / 2, -Math.PI / 2 + beat / hazard.period * Math.PI * 2);
    ctx.strokeStyle = '#f4be7a'; ctx.stroke();
    ctx.font = '20px serif'; ctx.textAlign = 'center'; ctx.fillStyle = active ? '#ffe3c1' : '#a77f58';
    ctx.fillText('✦', hazard.x, hazard.y + 7);
  }
  const boss = game.boss;
  if (boss) {
    if (boss.mode === 'warning' || boss.mode === 'strike') {
      ctx.beginPath(); ctx.arc(boss.targetX, boss.targetY, 82, 0, Math.PI * 2);
      ctx.fillStyle = boss.mode === 'warning' ? 'rgba(246,110,72,.18)' : 'rgba(255,125,70,.65)';
      ctx.strokeStyle = '#ffb578'; ctx.lineWidth = 3; ctx.fill(); ctx.stroke();
      ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffe1ba';
      ctx.fillText('NÉ!', boss.targetX, boss.targetY - 90);
    }
    for (const shot of boss.projectiles) {
      ctx.beginPath(); ctx.arc(shot.x, shot.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ed9d65'; ctx.shadowColor = '#ff7b4d'; ctx.shadowBlur = 15; ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.save(); ctx.translate(boss.x, boss.y);
    const pulse = Math.sin(time * 2.5) * 3;
    ctx.fillStyle = '#101b17'; ctx.beginPath(); ctx.ellipse(0, 26, 62, 21, 0, 0, Math.PI * 2); ctx.fill();
    // The guardian is assembled from stone, roots and a burning hollow core.
    ctx.strokeStyle = '#566349'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * 28, -18); ctx.lineTo(side * 59, 0); ctx.lineTo(side * 70, 26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(side * 18, -43); ctx.lineTo(side * 36, -67); ctx.lineTo(side * 52, -72); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(side * 18, 18); ctx.lineTo(side * 31, 40); ctx.stroke();
    }
    ctx.fillStyle = boss.hitFlash > 0 ? '#ead8b1' : '#4d5c47';
    ctx.strokeStyle = '#8a9470'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-39, -23); ctx.lineTo(-21, -52); ctx.lineTo(21, -52);
    ctx.lineTo(39, -23); ctx.lineTo(32, 24); ctx.lineTo(0, 40); ctx.lineTo(-32, 24); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2c4032'; ctx.fillRect(-34, -26, 68, 12);
    ctx.shadowColor = '#e7aa68'; ctx.shadowBlur = 24;
    ctx.fillStyle = boss.phase === 3 ? '#ff9375' : '#f0ce8e';
    ctx.beginPath(); ctx.moveTo(0, -18 + pulse); ctx.lineTo(13, 0 + pulse); ctx.lineTo(0, 20 + pulse); ctx.lineTo(-13, pulse); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillRect(-18, -35, 10, 3); ctx.fillRect(8, -35, 10, 3);
    ctx.restore();
    if (game.campaign.forged) {
      ctx.save(); ctx.translate(game.player.x, game.player.y);
      const angle = game.player.direction === 'left' ? -1.5 : game.player.direction === 'up' ? -2.7 : game.player.direction === 'down' ? .4 : -0.8;
      ctx.rotate(angle + (game.attackFlash > 0 ? (0.22 - game.attackFlash) * 18 : 0));
      ctx.fillStyle = '#dcece2'; ctx.shadowColor = '#6de7d2'; ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.moveTo(18, -7); ctx.lineTo(20, -48); ctx.lineTo(25, -56); ctx.lineTo(30, -48); ctx.lineTo(28, -7); ctx.fill();
      ctx.fillStyle = '#d5ad6c'; ctx.fillRect(12, -9, 23, 4); ctx.fillStyle = '#78553c'; ctx.fillRect(21, -5, 5, 14);
      if (game.attackFlash > 0) {
        ctx.beginPath(); ctx.arc(0, 0, 94, -2, 1.4); ctx.strokeStyle = 'rgba(167,255,226,.8)'; ctx.lineWidth = 7; ctx.stroke();
      }
      ctx.restore();
    }
  }
  if (game.invulnerability > 0) {
    ctx.beginPath(); ctx.arc(game.player.x, game.player.y, 24, 0, Math.PI * 2);
    ctx.strokeStyle = '#ecc99d'; ctx.globalAlpha = .5 + Math.sin(time * 25) * .3; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.restore();
}
