import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface GameObject {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'mario' | 'tram' | 'coin' | 'obstacle'
  color?: string
  collected?: boolean
}

interface GameState {
  mario: GameObject
  trams: GameObject[]
  coins: GameObject[]
  obstacles: GameObject[]
  score: number
  lives: number
  level: number
  gameStarted: boolean
  gameOver: boolean
  isPaused: boolean
}

const GAME_WIDTH = 800
const GAME_HEIGHT = 400
const MARIO_SPEED = 5
const TRAM_SPEED = 2
const JUMP_HEIGHT = 120
const JUMP_DURATION = 600

export default function GameEngine() {
  const gameLoopRef = useRef<number>()
  const [gameState, setGameState] = useState<GameState>({
    mario: {
      id: 'mario',
      x: 100,
      y: 300,
      width: 40,
      height: 40,
      type: 'mario'
    },
    trams: [
      { id: 'tram1', x: 200, y: 280, width: 120, height: 80, type: 'tram', color: '#FF6B35' },
      { id: 'tram2', x: 400, y: 280, width: 120, height: 80, type: 'tram', color: '#4A90E2' },
      { id: 'tram3', x: 600, y: 280, width: 120, height: 80, type: 'tram', color: '#FFD700' }
    ],
    coins: [
      { id: 'coin1', x: 250, y: 200, width: 20, height: 20, type: 'coin', collected: false },
      { id: 'coin2', x: 450, y: 200, width: 20, height: 20, type: 'coin', collected: false },
      { id: 'coin3', x: 650, y: 200, width: 20, height: 20, type: 'coin', collected: false },
      { id: 'coin4', x: 350, y: 150, width: 20, height: 20, type: 'coin', collected: false },
      { id: 'coin5', x: 550, y: 150, width: 20, height: 20, type: 'coin', collected: false }
    ],
    obstacles: [
      { id: 'obstacle1', x: 300, y: 260, width: 30, height: 30, type: 'obstacle' }
    ],
    score: 0,
    lives: 3,
    level: 1,
    gameStarted: false,
    gameOver: false,
    isPaused: false
  })

  const [isJumping, setIsJumping] = useState(false)
  const [keys, setKeys] = useState<Set<string>>(new Set())

  // Проверка коллизий
  const checkCollision = useCallback((obj1: GameObject, obj2: GameObject): boolean => {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y
  }, [])

  // Прыжок Марио
  const jump = useCallback(() => {
    if (!isJumping && gameState.gameStarted && !gameState.gameOver && !gameState.isPaused) {
      setIsJumping(true)
      
      setGameState(prev => ({
        ...prev,
        mario: { ...prev.mario, y: prev.mario.y - JUMP_HEIGHT }
      }))

      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          mario: { ...prev.mario, y: prev.mario.y + JUMP_HEIGHT }
        }))
        setIsJumping(false)
      }, JUMP_DURATION)
    }
  }, [isJumping, gameState.gameStarted, gameState.gameOver, gameState.isPaused])

  // Движение Марио
  const moveMario = useCallback((direction: 'left' | 'right') => {
    if (!gameState.gameStarted || gameState.gameOver || gameState.isPaused) return

    setGameState(prev => {
      const newX = direction === 'left' 
        ? Math.max(0, prev.mario.x - MARIO_SPEED)
        : Math.min(GAME_WIDTH - prev.mario.width, prev.mario.x + MARIO_SPEED)
      
      return {
        ...prev,
        mario: { ...prev.mario, x: newX }
      }
    })
  }, [gameState.gameStarted, gameState.gameOver, gameState.isPaused])

  // Обработка клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set([...prev, e.code]))
      
      switch(e.code) {
        case 'Space':
          e.preventDefault()
          jump()
          break
        case 'Escape':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))
          break
        case 'KeyR':
          if (gameState.gameOver) {
            restartGame()
          }
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete(e.code)
        return newKeys
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [jump, gameState.gameOver])

  // Обработка движения по клавишам
  useEffect(() => {
    const interval = setInterval(() => {
      if (keys.has('ArrowLeft')) moveMario('left')
      if (keys.has('ArrowRight')) moveMario('right')
    }, 16) // ~60 FPS

    return () => clearInterval(interval)
  }, [keys, moveMario])

  // Основной игровой цикл
  useEffect(() => {
    if (!gameState.gameStarted || gameState.gameOver || gameState.isPaused) return

    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        const newState = { ...prev }

        // Движение трамваев
        newState.trams = prev.trams.map(tram => {
          let newX = tram.x - TRAM_SPEED
          
          // Если трамвай ушел за левую границу, появляется справа
          if (newX + tram.width < 0) {
            newX = GAME_WIDTH + Math.random() * 200
          }
          
          return { ...tram, x: newX }
        })

        // Проверка коллизий с монетами
        newState.coins = prev.coins.map(coin => {
          if (!coin.collected && checkCollision(prev.mario, coin)) {
            newState.score += 100
            return { ...coin, collected: true }
          }
          return coin
        })

        // Проверка коллизий с трамваями (платформы)
        let marioOnPlatform = false
        for (const tram of newState.trams) {
          if (checkCollision(prev.mario, tram)) {
            // Если Марио сверху трамвая
            if (prev.mario.y + prev.mario.height - 10 <= tram.y) {
              newState.mario = { 
                ...prev.mario, 
                y: tram.y - prev.mario.height,
                x: prev.mario.x + (tram.x - prev.trams.find(t => t.id === tram.id)!.x) // Движение с трамваем
              }
              marioOnPlatform = true
              break
            } else {
              // Столкновение сбоку - потеря жизни
              newState.lives -= 1
              newState.mario = { ...prev.mario, x: 100, y: 300 } // Респавн
              
              if (newState.lives <= 0) {
                newState.gameOver = true
              }
              break
            }
          }
        }

        // Гравитация для Марио (если не на платформе и не прыгает)
        if (!marioOnPlatform && !isJumping && prev.mario.y < 300) {
          newState.mario = { ...prev.mario, y: Math.min(300, prev.mario.y + 5) }
        }

        // Проверка падения
        if (prev.mario.y > GAME_HEIGHT) {
          newState.lives -= 1
          newState.mario = { ...prev.mario, x: 100, y: 300 }
          
          if (newState.lives <= 0) {
            newState.gameOver = true
          }
        }

        // Проверка победы (все монеты собраны)
        const remainingCoins = newState.coins.filter(coin => !coin.collected)
        if (remainingCoins.length === 0) {
          newState.score += 1000
          newState.level += 1
          // Добавляем новые монеты для следующего уровня
          newState.coins = [
            { id: `coin${Date.now()}1`, x: 250, y: 200, width: 20, height: 20, type: 'coin', collected: false },
            { id: `coin${Date.now()}2`, x: 450, y: 200, width: 20, height: 20, type: 'coin', collected: false },
            { id: `coin${Date.now()}3`, x: 650, y: 200, width: 20, height: 20, type: 'coin', collected: false },
            { id: `coin${Date.now()}4`, x: 350, y: 150, width: 20, height: 20, type: 'coin', collected: false },
            { id: `coin${Date.now()}5`, x: 550, y: 150, width: 20, height: 20, type: 'coin', collected: false }
          ]
        }

        return newState
      })
    }, 1000 / 60) // 60 FPS

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState.gameStarted, gameState.gameOver, gameState.isPaused, isJumping, checkCollision])

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true, gameOver: false }))
  }

  const restartGame = () => {
    setGameState({
      mario: { id: 'mario', x: 100, y: 300, width: 40, height: 40, type: 'mario' },
      trams: [
        { id: 'tram1', x: 200, y: 280, width: 120, height: 80, type: 'tram', color: '#FF6B35' },
        { id: 'tram2', x: 400, y: 280, width: 120, height: 80, type: 'tram', color: '#4A90E2' },
        { id: 'tram3', x: 600, y: 280, width: 120, height: 80, type: 'tram', color: '#FFD700' }
      ],
      coins: [
        { id: 'coin1', x: 250, y: 200, width: 20, height: 20, type: 'coin', collected: false },
        { id: 'coin2', x: 450, y: 200, width: 20, height: 20, type: 'coin', collected: false },
        { id: 'coin3', x: 650, y: 200, width: 20, height: 20, type: 'coin', collected: false },
        { id: 'coin4', x: 350, y: 150, width: 20, height: 20, type: 'coin', collected: false },
        { id: 'coin5', x: 550, y: 150, width: 20, height: 20, type: 'coin', collected: false }
      ],
      obstacles: [
        { id: 'obstacle1', x: 300, y: 260, width: 30, height: 30, type: 'obstacle' }
      ],
      score: 0,
      lives: 3,
      level: 1,
      gameStarted: true,
      gameOver: false,
      isPaused: false
    })
    setIsJumping(false)
  }

  return (
    <Card className="border-4 border-black max-w-6xl mx-auto">
      <CardHeader className="bg-black text-white">
        <CardTitle className="pixel-font text-center text-2xl">🎮 MARIO TRAM GAME</CardTitle>
        <CardDescription className="text-center text-gray-300 space-x-4">
          <span>Уровень: {gameState.level}</span>
          <span>Очки: {gameState.score}</span>
          <span>Жизни: {Array(gameState.lives).fill('❤️').join('')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          className="relative bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 overflow-hidden border-4 border-black"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Облака */}
          <div className="absolute top-4 left-10 text-2xl opacity-70">☁️</div>
          <div className="absolute top-8 right-20 text-xl opacity-70">☁️</div>
          <div className="absolute top-2 left-1/2 text-lg opacity-70">☁️</div>
          
          {/* Солнце */}
          <div className="absolute top-4 right-4 text-2xl">☀️</div>
          
          {/* Трамвайные пути */}
          <div className="absolute bottom-16 w-full h-2 bg-gray-700 border-y border-gray-800"></div>
          <div className="absolute bottom-12 w-full h-2 bg-gray-700 border-y border-gray-800"></div>
          
          {/* Трамваи */}
          {gameState.trams.map(tram => (
            <div
              key={tram.id}
              className="absolute border-4 border-black rounded-lg shadow-lg"
              style={{
                left: `${tram.x}px`,
                top: `${tram.y}px`,
                width: `${tram.width}px`,
                height: `${tram.height}px`,
                backgroundColor: tram.color
              }}
            >
              {/* Окна трамвая */}
              <div className="absolute top-1 left-2 w-4 h-4 bg-yellow-300 rounded border border-black"></div>
              <div className="absolute top-1 right-2 w-4 h-4 bg-yellow-300 rounded border border-black"></div>
              {/* Колеса */}
              <div className="absolute bottom-1 left-3 w-6 h-3 bg-gray-800 rounded-full"></div>
              <div className="absolute bottom-1 right-3 w-6 h-3 bg-gray-800 rounded-full"></div>
            </div>
          ))}
          
          {/* Монеты */}
          {gameState.coins.map(coin => 
            !coin.collected && (
              <div
                key={coin.id}
                className="absolute text-2xl animate-spin"
                style={{
                  left: `${coin.x}px`,
                  top: `${coin.y}px`
                }}
              >
                🪙
              </div>
            )
          )}
          
          {/* Препятствия */}
          {gameState.obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="absolute text-2xl"
              style={{
                left: `${obstacle.x}px`,
                top: `${obstacle.y}px`
              }}
            >
              🚧
            </div>
          ))}
          
          {/* Марио */}
          <div
            className={`absolute text-4xl transition-all duration-100 ${isJumping ? 'animate-bounce' : ''}`}
            style={{
              left: `${gameState.mario.x}px`,
              top: `${gameState.mario.y}px`,
              width: `${gameState.mario.width}px`,
              height: `${gameState.mario.height}px`
            }}
          >
            🍄
          </div>
          
          {/* Игровые сообщения */}
          {!gameState.gameStarted && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl pixel-font text-white mb-4">🚋 MARIO TRAM GAME 🚋</div>
                <Button onClick={startGame} className="bg-game-red hover:bg-red-600 text-white pixel-font text-xl px-8 py-4">
                  🚀 НАЧАТЬ ИГРУ
                </Button>
              </div>
            </div>
          )}
          
          {gameState.isPaused && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-6xl pixel-font text-white">⏸️ ПАУЗА</div>
            </div>
          )}
          
          {gameState.gameOver && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl pixel-font text-white mb-4">💀 ИГРА ОКОНЧЕНА</div>
                <div className="text-xl text-white mb-4">Финальный счет: {gameState.score}</div>
                <Button onClick={restartGame} className="bg-game-red hover:bg-red-600 text-white pixel-font text-xl px-8 py-4">
                  🔄 ИГРАТЬ СНОВА
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Управление */}
        <div className="p-6 bg-black text-white">
          <div className="text-center space-y-4">
            <div className="pixel-font text-lg">УПРАВЛЕНИЕ:</div>
            <div className="flex justify-center gap-8 text-sm">
              <span>⬅️ ➡️ Движение</span>
              <span>🔳 ПРОБЕЛ - Прыжок</span>
              <span>⏸️ ESC - Пауза</span>
              <span>🔄 R - Рестарт</span>
            </div>
            <div className="text-xs text-gray-400">
              Цель: собери все монеты, прыгая по трамваям! Избегай столкновений сбоку.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}