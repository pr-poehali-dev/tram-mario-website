import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [marioPosition, setMarioPosition] = useState({ x: 50, y: 300 })
  const [isJumping, setIsJumping] = useState(false)
  const [score, setScore] = useState(1250)
  const [lives, setLives] = useState(3)
  
  const handleJump = () => {
    if (!isJumping) {
      setIsJumping(true)
      setMarioPosition(prev => ({ ...prev, y: prev.y - 100 }))
      setTimeout(() => {
        setMarioPosition(prev => ({ ...prev, y: prev.y + 100 }))
        setIsJumping(false)
      }, 500)
    }
  }

  const handleMove = (direction: 'left' | 'right') => {
    setMarioPosition(prev => ({
      ...prev,
      x: direction === 'left' ? Math.max(0, prev.x - 50) : Math.min(800, prev.x + 50)
    }))
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'ArrowLeft':
          handleMove('left')
          break
        case 'ArrowRight':
          handleMove('right')
          break
        case 'Space':
          e.preventDefault()
          handleJump()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isJumping])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-yellow-300">
      {/* Header */}
      <header className="bg-black/80 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold pixel-font text-game-red">MARIO TRAM GAME</h1>
          <div className="flex items-center gap-4">
            <span className="pixel-font text-sm">ОЧКИ: {score}</span>
            <span className="pixel-font text-sm">
              ЖИЗНИ: {Array(lives).fill('❤️').join('')}
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-black/20">
            <TabsTrigger value="home" className="pixel-font text-xs data-[state=active]:bg-game-red data-[state=active]:text-white">
              🏠 Главная
            </TabsTrigger>
            <TabsTrigger value="game" className="pixel-font text-xs data-[state=active]:bg-game-red data-[state=active]:text-white">
              🎮 Игра
            </TabsTrigger>
            <TabsTrigger value="levels" className="pixel-font text-xs data-[state=active]:bg-game-red data-[state=active]:text-white">
              🏆 Уровни
            </TabsTrigger>
            <TabsTrigger value="about" className="pixel-font text-xs data-[state=active]:bg-game-red data-[state=active]:text-white">
              ℹ️ О игре
            </TabsTrigger>
          </TabsList>

          {/* Главная страница */}
          <TabsContent value="home" className="space-y-8">
            <div className="text-center space-y-6">
              <h2 className="text-6xl font-bold pixel-font text-game-red mb-4 drop-shadow-lg">
                MARIO TRAM GAME
              </h2>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed bg-white/80 p-6 rounded-lg">
                🚋 Прыгай по вагонам трамвая вместе с Марио! Собирай монеты, избегай препятствий и покоряй новые уровни в этом пиксельном ретро-платформере.
              </p>
              
              <div className="flex justify-center gap-6">
                <Button size="lg" className="bg-game-red hover:bg-red-600 text-white pixel-font text-lg px-8 py-4 shadow-lg">
                  🚀 НАЧАТЬ ИГРУ
                </Button>
                <Button size="lg" variant="outline" className="pixel-font text-lg px-8 py-4 border-4 border-black hover:bg-game-yellow">
                  📋 ПРАВИЛА
                </Button>
              </div>
            </div>

            {/* Превью игры */}
            <Card className="max-w-5xl mx-auto border-4 border-black shadow-2xl">
              <CardHeader className="bg-black text-white">
                <CardTitle className="pixel-font text-center text-2xl">🎮 ДЕМО ИГРЫ</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Попробуй управление! Стрелки влево/вправо для движения, ПРОБЕЛ для прыжка
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 h-80 rounded-lg overflow-hidden border-4 border-black">
                  {/* Облака */}
                  <div className="absolute top-4 left-10 text-4xl opacity-70">☁️</div>
                  <div className="absolute top-8 right-20 text-3xl opacity-70">☁️</div>
                  <div className="absolute top-2 left-1/2 text-2xl opacity-70">☁️</div>
                  
                  {/* Солнце */}
                  <div className="absolute top-4 right-4 text-4xl">☀️</div>
                  
                  {/* Трамвайные пути */}
                  <div className="absolute bottom-16 w-full h-2 bg-gray-700 border-y border-gray-800"></div>
                  <div className="absolute bottom-12 w-full h-2 bg-gray-700 border-y border-gray-800"></div>
                  
                  {/* Вагоны трамвая */}
                  <div className="absolute bottom-20 left-10 w-28 h-20 bg-game-red border-4 border-black rounded-lg shadow-lg">
                    <div className="absolute top-1 left-1 w-4 h-4 bg-yellow-300 rounded border border-black"></div>
                    <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-300 rounded border border-black"></div>
                    <div className="absolute bottom-1 left-2 w-6 h-3 bg-gray-800 rounded-full"></div>
                    <div className="absolute bottom-1 right-2 w-6 h-3 bg-gray-800 rounded-full"></div>
                  </div>
                  
                  <div className="absolute bottom-20 left-44 w-28 h-20 bg-game-blue border-4 border-black rounded-lg shadow-lg">
                    <div className="absolute top-1 left-1 w-4 h-4 bg-yellow-300 rounded border border-black"></div>
                    <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-300 rounded border border-black"></div>
                    <div className="absolute bottom-1 left-2 w-6 h-3 bg-gray-800 rounded-full"></div>
                    <div className="absolute bottom-1 right-2 w-6 h-3 bg-gray-800 rounded-full"></div>
                  </div>
                  
                  <div className="absolute bottom-20 right-10 w-28 h-20 bg-game-yellow border-4 border-black rounded-lg shadow-lg">
                    <div className="absolute top-1 left-1 w-4 h-4 bg-red-500 rounded border border-black"></div>
                    <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded border border-black"></div>
                    <div className="absolute bottom-1 left-2 w-6 h-3 bg-gray-800 rounded-full"></div>
                    <div className="absolute bottom-1 right-2 w-6 h-3 bg-gray-800 rounded-full"></div>
                  </div>
                  
                  {/* Марио */}
                  <div 
                    className={`absolute w-12 h-12 transition-all duration-300 text-4xl ${isJumping ? 'animate-bounce' : ''}`}
                    style={{ 
                      left: `${marioPosition.x}px`, 
                      bottom: `${400 - marioPosition.y}px` 
                    }}
                  >
                    🍄
                  </div>
                  
                  {/* Монеты */}
                  <div className="absolute bottom-48 left-20 text-3xl animate-spin">🪙</div>
                  <div className="absolute bottom-48 left-52 text-3xl animate-spin">🪙</div>
                  <div className="absolute bottom-48 right-20 text-3xl animate-spin">🪙</div>
                  
                  {/* Препятствия */}
                  <div className="absolute bottom-44 left-72 text-2xl">🚧</div>
                </div>
                
                {/* Управление */}
                <div className="flex justify-center gap-4 mt-6">
                  <Button 
                    onClick={() => handleMove('left')}
                    className="bg-game-blue hover:bg-blue-600 text-white pixel-font shadow-lg"
                    size="lg"
                  >
                    ⬅️ ВЛЕВО
                  </Button>
                  <Button 
                    onClick={handleJump}
                    className="bg-game-yellow hover:bg-yellow-500 text-black pixel-font shadow-lg"
                    disabled={isJumping}
                    size="lg"
                  >
                    ⬆️ ПРЫЖОК
                  </Button>
                  <Button 
                    onClick={() => handleMove('right')}
                    className="bg-game-blue hover:bg-blue-600 text-white pixel-font shadow-lg"
                    size="lg"
                  >
                    ➡️ ВПРАВО
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Особенности игры */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="border-4 border-black bg-white/90">
                <CardHeader>
                  <CardTitle className="pixel-font text-center">🎯 УВЛЕКАТЕЛЬНЫЙ ГЕЙМПЛЕЙ</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Уникальная механика прыжков по движущимся трамваям создает захватывающий игровой опыт!</p>
                </CardContent>
              </Card>
              
              <Card className="border-4 border-black bg-white/90">
                <CardHeader>
                  <CardTitle className="pixel-font text-center">🏆 6 УРОВНЕЙ</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>От городских маршрутов до горных дорог - каждый уровень принесет новые вызовы!</p>
                </CardContent>
              </Card>
              
              <Card className="border-4 border-black bg-white/90">
                <CardHeader>
                  <CardTitle className="pixel-font text-center">🎨 РЕТРО СТИЛЬ</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Пиксельная графика и чиптюн музыка воссоздают атмосферу классических игр 90х!</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Игра */}
          <TabsContent value="game" className="space-y-6">
            <Card className="border-4 border-black">
              <CardHeader className="bg-black text-white">
                <CardTitle className="pixel-font text-center text-2xl">🎮 ИГРОВОЕ ПОЛЕ</CardTitle>
                <CardDescription className="text-center text-gray-300">
                  Уровень {currentLevel} | Очки: {score} | Жизни: {Array(lives).fill('❤️').join('')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative bg-gradient-to-b from-sky-400 to-green-400 h-96 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl pixel-font text-white bg-black/70 p-8 rounded-lg border-4 border-white">
                      🚧 ПОЛНАЯ ВЕРСИЯ СКОРО! 🚧
                      <div className="text-lg mt-4">Пока попробуй демо выше ⬆️</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Уровни */}
          <TabsContent value="levels" className="space-y-6">
            <h2 className="text-4xl font-bold pixel-font text-center mb-8 text-game-red drop-shadow-lg">
              🏆 ВЫБОР УРОВНЯ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 1, name: '🚋 Городской трамвай', difficulty: 'Легко', stars: 3 },
                { id: 2, name: '🌉 Мост через реку', difficulty: 'Легко', stars: 3 },
                { id: 3, name: '🏔️ Горная дорога', difficulty: 'Средне', stars: 2 },
                { id: 4, name: '🌙 Ночной город', difficulty: 'Средне', stars: 2 },
                { id: 5, name: '⚡ Скоростной экспресс', difficulty: 'Сложно', stars: 1 },
                { id: 6, name: '🏰 Замок Боузера', difficulty: 'Сложно', stars: 1 }
              ].map((level) => (
                <Card key={level.id} className="border-4 border-black hover:shadow-xl transition-all hover:scale-105 bg-white/90">
                  <CardHeader>
                    <CardTitle className="pixel-font text-center text-lg">
                      УРОВЕНЬ {level.id}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {Array(level.stars).fill('⭐').join('')}
                      <div className="mt-1 font-semibold">{level.difficulty}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="text-2xl mb-4">
                      {level.name}
                    </div>
                    <Button 
                      className={`w-full pixel-font ${
                        level.id <= currentLevel 
                          ? 'bg-game-green hover:bg-green-600 text-white' 
                          : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      }`}
                      disabled={level.id > currentLevel}
                      onClick={() => setCurrentLevel(level.id)}
                    >
                      {level.id <= currentLevel ? '🎮 ИГРАТЬ' : '🔒 ЗАБЛОКИРОВАНО'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* О игре */}
          <TabsContent value="about" className="space-y-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <Card className="border-4 border-black bg-white/95">
                <CardHeader className="bg-game-red text-white">
                  <CardTitle className="pixel-font text-center text-3xl">
                    ℹ️ О MARIO TRAM GAME
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <p className="text-xl leading-relaxed">
                    <strong>Mario Tram Game</strong> - это уникальный платформер, где классический геймплей Super Mario встречается с городским транспортом! 
                    Прыгай по движущимся вагонам трамвая, собирай монеты и избегай препятствий в этом ретро-приключении.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-2 border-game-blue">
                      <CardHeader>
                        <CardTitle className="pixel-font text-game-blue">🎯 ЦЕЛЬ ИГРЫ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>🚋 Прыгай по вагонам трамвая</li>
                          <li>🪙 Собирай золотые монеты</li>
                          <li>🚧 Избегай препятствий</li>
                          <li>🏁 Доберись до конца уровня</li>
                          <li>⭐ Набирай максимум очков</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-2 border-game-yellow">
                      <CardHeader>
                        <CardTitle className="pixel-font text-orange-600">🎮 УПРАВЛЕНИЕ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li>⬅️ ➡️ Движение влево/вправо</li>
                          <li>🔳 ПРОБЕЛ - Прыжок</li>
                          <li>⚡ SHIFT - Ускорение</li>
                          <li>⏸️ ESC - Пауза</li>
                          <li>🔄 R - Перезапуск уровня</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-game-yellow">
                    <CardHeader>
                      <CardTitle className="pixel-font text-orange-700">💡 СОВЕТЫ ПРО-ИГРОКА</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-2">
                          <li>⏰ Тайминг прыжка решает всё!</li>
                          <li>🏃 Используй разбег для дальних прыжков</li>
                          <li>👀 Следи за движением трамваев</li>
                          <li>🎯 Планируй маршрут заранее</li>
                        </ul>
                        <ul className="space-y-2">
                          <li>💰 Собирай монеты для бонусных жизней</li>
                          <li>🚨 Красные вагоны опасны!</li>
                          <li>⚡ Желтые дают скорость</li>
                          <li>🛡️ Синие дают защиту</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-black">
                    <CardHeader>
                      <CardTitle className="pixel-font">🏆 СИСТЕМА ОЧКОВ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-2xl">🪙</div>
                          <div className="font-bold">100 очков</div>
                          <div className="text-sm">За монету</div>
                        </div>
                        <div>
                          <div className="text-2xl">🚋</div>
                          <div className="font-bold">50 очков</div>
                          <div className="text-sm">За вагон</div>
                        </div>
                        <div>
                          <div className="text-2xl">⏱️</div>
                          <div className="font-bold">10 очков</div>
                          <div className="text-sm">За секунду</div>
                        </div>
                        <div>
                          <div className="text-2xl">🏁</div>
                          <div className="font-bold">1000 очков</div>
                          <div className="text-sm">За уровень</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white p-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="pixel-font">© 2024 MARIO TRAM GAME | Создано с ❤️ на poehali.dev</p>
        </div>
      </footer>
    </div>
  )
}

export default Index