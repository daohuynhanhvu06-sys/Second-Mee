import React, { useEffect, useRef, useState } from 'react';
import { GameEngine, type HUDState } from './game/GameEngine.ts';
import { Title, AdventureHUD, Completion, Forge, EndScreen } from './components/CampaignUI.tsx';

const initial: HUDState = { screen:'title', levelName:'LEVEL 01', levelSubtitle:'ECHO GROVE', recordingStatus:'idle',
  recordingTimeRemaining:8000, echoStatus:'none', echoCount:0, isMuted:false, bannerMessage:'', elapsedLevelTime:0,
  completed:[], forged:false, lastReward:null, health:5, bossHp:0, bossPhase:0, attackCooldown:0, dodgeCooldown:0, legTimeRemaining:null, checkpointIndex:0, checkpointCount:0, slowed:false, defeatReason:'damage' };
export default function AdventureApp({ prepare }: { prepare?: (engine: GameEngine) => void } = {}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ref = useRef<GameEngine | null>(null);
  const [hud, setHud] = useState(initial);
  useEffect(() => {
    const engine = new GameEngine(); ref.current = engine;
    engine.setCanvas(canvas.current); engine.onHUDChange = state => setHud({ ...state }); engine.start();
    prepare?.(engine);
    return () => engine.stop();
  }, []);
  const engine = ref.current;
  return <main className="adventure-app"><div className="game-stage"><canvas ref={canvas} width={1280} height={720} data-testid="game-canvas"/>
    {hud.screen === 'title' && <Title engine={engine} hud={hud}/>}
    {hud.screen === 'playing' && <AdventureHUD engine={engine} hud={hud}/>}
    {hud.screen === 'victory' && <Completion engine={engine} hud={hud}/>}
    {hud.screen === 'forge' && <Forge engine={engine} hud={hud}/>}
    {(hud.screen === 'ending' || hud.screen === 'defeat') && <EndScreen engine={engine} hud={hud}/>}
    {hud.screen === 'paused' && <div className="modal-backdrop"><div className="panel pause-panel"><span className="eyebrow gold">MỘT KHOẢNG LẶNG</span><h2>Tạm dừng</h2><button className="primary" onClick={()=>engine?.resumeGame()}>TIẾP TỤC</button><button className="secondary" onClick={()=>engine?.restartLevel()}>CHƠI LẠI MÀN</button><button className="text-button" onClick={()=>engine?.goToTitle()}>VỀ MENU</button></div></div>}
  </div></main>;
}
