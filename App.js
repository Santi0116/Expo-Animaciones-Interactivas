
import 'react-native-gesture-handler';

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  PanResponder,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';

const Drawer = createDrawerNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;

// COMPONENTES GENERALES

function Page({ title, subtitle, children }) {
  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={s.pageTitle}>{title}</Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      {children}
    </ScrollView>
  );
}

function Panel({ children, style }) {
  return <View style={[s.panel, style]}>{children}</View>;
}

function Hint({ children }) {
  return (
    <View style={s.hint}>
      <Text style={s.hintText}>💡 {children}</Text>
    </View>
  );
}

// INICIO

function HomeScreen({ navigation }) {
  const exercises = [
    ['01', 'Arrastrar y rotar', 'Mueve una figura y observa cómo gira.', 'Arrastrar y rotar'],
    ['02', 'Animación de carga', 'Spinner y barra de progreso.', 'Animación de carga'],
    ['03', 'Gestos multitáctiles', 'Mueve, amplía y rota una figura.', 'Gestos multitáctiles'],
    ['04', 'Efecto rebote', 'Presiona la figura para comprimirla.', 'Efecto rebote'],
    ['05', 'Carrusel animado', 'Desliza entre tarjetas.', 'Carrusel animado'],
    ['06', 'Acelerómetro', 'Agita el dispositivo.', 'Acelerómetro'],
  ];

  return (
    <Page
      title="Animaciones interactivas"
      subtitle="Siete apartados prácticos con Expo y React Native."
    >
      <Panel style={{ marginTop: 20 }}>
        <Text style={s.panelTitle}>Tu espacio de prácticas</Text>
        <Text style={s.body}>
          Explora gestos, sensores y transiciones animadas desde una sola aplicación.
        </Text>

        <View style={s.statsRow}>
          <View>
            <Text style={s.statNum}>06</Text>
            <Text style={s.statLabel}>Experimentos</Text>
          </View>
          <View>
            <Text style={s.statNum}>01</Text>
            <Text style={s.statLabel}>Menú lateral</Text>
          </View>
          <View>
            <Text style={s.statNum}>100%</Text>
            <Text style={s.statLabel}>Interactivo</Text>
          </View>
        </View>
      </Panel>

      <Text style={s.sectionTitle}>Ejercicios</Text>

      {exercises.map(([n, title, desc, route]) => (
        <Pressable
          key={n}
          onPress={() => navigation.navigate(route)}
          style={({ pressed }) => [
            s.exerciseRow,
            pressed && { opacity: 0.7 },
          ]}
        >
          <View style={s.number}>
            <Text style={s.numberText}>{n}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={s.exerciseTitle}>{title}</Text>
            <Text style={s.exerciseDesc}>{desc}</Text>
          </View>

          <Text style={s.chevron}>›</Text>
        </Pressable>
      ))}

      <Hint>
        También puedes abrir el menú lateral deslizando desde el borde izquierdo.
      </Hint>
    </Page>
  );
}

// EJERCICIO 1: ARRASTRAR Y ROTAR

function DragRotateScreen() {
  const pan = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: (_, gesture) => {
        pan.setValue({ x: gesture.dx, y: gesture.dy });
        rotation.setValue(gesture.dx / 2);
      },

      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }),
          Animated.spring(rotation, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  const rotate = rotation.interpolate({
    inputRange: [-180, 180],
    outputRange: ['-180deg', '180deg'],
  });

  return (
    <Page
      title="Arrastrar y rotar"
      subtitle="Mantén presionada la figura y desplázala por la pantalla."
    >
      <Panel style={s.demoArea}>
        <Animated.View
          {...responder.panHandlers}
          style={[
            s.movable,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                { rotate },
              ],
            },
          ]}
        >
          <Text style={s.movableText}>✦</Text>
        </Animated.View>
        <Text style={s.body}>Arrastra la figura con tu dedo.</Text>
      </Panel>
      <Hint>Al soltar la figura, volverá suavemente a su posición inicial.</Hint>
    </Page>
  );
}

// EJERCICIO 2: ANIMACIÓN DE CARGA

function LoadingScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Page
      title="Animación de carga"
      subtitle="Ejemplo de indicador de carga y barra de progreso."
    >
      <Panel style={s.demoArea}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={s.panelTitle}>Cargando contenido...</Text>

        <View style={s.progressBackground}>
          <Animated.View style={[s.progressFill, { width }]} />
        </View>

        <Text style={s.body}>Progreso animado continuamente</Text>
      </Panel>
      <Hint>La barra se llena y vuelve a comenzar automáticamente.</Hint>
    </Page>
  );
}

// EJERCICIO 3: GESTOS MULTITÁCTILES

function MultitouchScreen() {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const initialDistance = useRef(0);
  const initialAngle = useRef(0);
  const initialScale = useRef(1);
  const initialRotation = useRef(0);

  const getDistance = (a, b) => {
    return Math.sqrt(
      Math.pow(b.pageX - a.pageX, 2) +
      Math.pow(b.pageY - a.pageY, 2)
    );
  };

  const getAngle = (a, b) => {
    return Math.atan2(
      b.pageY - a.pageY,
      b.pageX - a.pageX
    ) * (180 / Math.PI);
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length >= 2) {
          initialDistance.current = getDistance(touches[0], touches[1]);
          initialAngle.current = getAngle(touches[0], touches[1]);
          initialScale.current = scale;
          initialRotation.current = rotation;
        }
      },

      onPanResponderMove: (evt, gesture) => {
        const touches = evt.nativeEvent.touches;

        if (touches.length >= 2) {
          const distance = getDistance(touches[0], touches[1]);
          const angle = getAngle(touches[0], touches[1]);

          if (initialDistance.current > 0) {
            const newScale =
              initialScale.current * (distance / initialDistance.current);

            setScale(Math.max(0.5, Math.min(2.5, newScale)));
            setRotation(
              initialRotation.current + angle - initialAngle.current
            );
          }
        } else {
          setPosition({ x: gesture.dx, y: gesture.dy });
        }
      },

      onPanResponderRelease: () => {
        initialDistance.current = 0;
      },
    })
  ).current;

  return (
    <Page
      title="Gestos multitáctiles"
      subtitle="Usa uno o dos dedos para interactuar con la figura."
    >
      <Panel style={s.demoArea}>
        <View
          {...responder.panHandlers}
          style={s.touchArea}
        >
          <View
            style={[
              s.multitouchFigure,
              {
                transform: [
                  { translateX: position.x },
                  { translateY: position.y },
                  { scale },
                  { rotate: `${rotation}deg` },
                ],
              },
            ]}
          >
            <Text style={s.movableText}>✦</Text>
          </View>
        </View>
        <Text style={s.body}>Arrastra, pellizca y rota con los dedos.</Text>
        <Text style={s.body}>
          Escala: {scale.toFixed(2)}x | Rotación: {Math.round(rotation)}°
        </Text>
      </Panel>

      <Hint>
        Utiliza dos dedos para ampliar, reducir y rotar la figura.
      </Hint>
    </Page>
  );
}

// EJERCICIO 4: EFECTO REBOTE

function BounceScreen() {
  const bounce = useRef(new Animated.Value(1)).current;

  const animateBounce = () => {
    Animated.sequence([
      Animated.spring(bounce, {
        toValue: 0.65,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(bounce, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Page
      title="Efecto rebote"
      subtitle="Presiona la figura para observar la animación."
    >
      <Panel style={s.demoArea}>
        <Pressable onPress={animateBounce}>
          <Animated.View
            style={[
              s.bounceFigure,
              {
                transform: [{ scale: bounce }],
              },
            ]}
          >
            <Text style={s.movableText}>●</Text>
          </Animated.View>
        </Pressable>

        <Text style={s.body}>Presiona la figura.</Text>
      </Panel>
      <Hint>La figura se comprime y recupera su tamaño mediante un efecto rebote.</Hint>
    </Page>
  );
}

// EJERCICIO 5: CARRUSEL ANIMADO

function CarouselScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    { title: 'Creatividad', description: 'Diseña experiencias visuales.', emoji: '🎨' },
    { title: 'Movimiento', description: 'Aprende a animar elementos.', emoji: '🚀' },
    { title: 'Interacción', description: 'Responde a los gestos del usuario.', emoji: '👆' },
    { title: 'Tecnología', description: 'Construye aplicaciones modernas.', emoji: '💻' },
  ];

  const cardWidth = SCREEN_WIDTH - 64;

  return (
    <Page
      title="Carrusel animado"
      subtitle="Desliza horizontalmente para cambiar de tarjeta."
    >
      <Panel style={s.demoArea}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / cardWidth
            );
            setActiveIndex(index);
          }}
        >
          {cards.map((card, index) => (
            <View
              key={card.title}
              style={[s.carouselCard, { width: cardWidth }]}
            >
              <Text style={s.carouselEmoji}>{card.emoji}</Text>
              <Text style={s.carouselTitle}>{card.title}</Text>
              <Text style={s.body}>{card.description}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={s.body}>
          Tarjeta {activeIndex + 1} de {cards.length}
        </Text>

        <View style={s.dots}>
          {cards.map((card, index) => (
            <View
              key={card.title}
              style={[
                s.dot,
                activeIndex === index && s.activeDot,
              ]}
            />
          ))}
        </View>
      </Panel>
      <Hint>Desliza hacia la izquierda o derecha para explorar las tarjetas.</Hint>
    </Page>
  );
}

// EJERCICIO 6: ACELERÓMETRO

function AccelerometerScreen() {
  const [sensorData, setSensorData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [shake, setShake] = useState(false);
  const lastShake = useRef(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(150);

    const subscription = Accelerometer.addListener((data) => {
      setSensorData(data);

      const magnitude = Math.sqrt(
        data.x * data.x +
        data.y * data.y +
        data.z * data.z
      );

      if (magnitude > 1.7 && Date.now() - lastShake.current > 1200) {
        lastShake.current = Date.now();
        setShake(true);

        setTimeout(() => {
          setShake(false);
        }, 800);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Page
      title="Acelerómetro"
      subtitle="Mueve o agita tu dispositivo para activar la animación."
    >
      <Panel style={s.demoArea}>
        <Text style={s.sensorEmoji}>
          {shake ? '🎉' : '📱'}
        </Text>

        <Text style={s.panelTitle}>
          {shake ? '¡Movimiento detectado!' : 'Esperando movimiento...'}
        </Text>

        <View style={s.sensorValues}>
          <Text style={s.sensorText}>X: {sensorData.x.toFixed(2)}</Text>
          <Text style={s.sensorText}>Y: {sensorData.y.toFixed(2)}</Text>
          <Text style={s.sensorText}>Z: {sensorData.z.toFixed(2)}</Text>
        </View>
      </Panel>

      <Hint>
        Este ejercicio necesita un dispositivo físico para detectar el movimiento.
        En algunos simuladores el acelerómetro no está disponible.
      </Hint>
    </Page>
  );
}

// NAVEGACIÓN PRINCIPAL

function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#111827" />

        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Inicio"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#111827',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              drawerStyle: {
                backgroundColor: '#1F2937',
                width: 285,
              },
              drawerActiveTintColor: '#A78BFA',
              drawerInactiveTintColor: '#E5E7EB',
              drawerActiveBackgroundColor: '#374151',
              drawerLabelStyle: {
                fontSize: 14,
                fontWeight: '600',
              },
            }}
          >
            <Drawer.Screen
              name="Inicio"
              component={HomeScreen}
            />

            <Drawer.Screen
              name="Arrastrar y rotar"
              component={DragRotateScreen}
            />

            <Drawer.Screen
              name="Animación de carga"
              component={LoadingScreen}
            />

            <Drawer.Screen
              name="Gestos multitáctiles"
              component={MultitouchScreen}
            />

            <Drawer.Screen
              name="Efecto rebote"
              component={BounceScreen}
            />

            <Drawer.Screen
              name="Carrusel animado"
              component={CarouselScreen}
            />

            <Drawer.Screen
              name="Acelerómetro"
              component={AccelerometerScreen}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default App;

// ESTILOS

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 21,
  },
  panel: {
    backgroundColor: '#1F2937',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  panelTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    color: '#D1D5DB',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  statNum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A78BFA',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 5,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 14,
    padding: 15,
    marginBottom: 11,
  },
  number: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#4C1D95',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  exerciseTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  exerciseDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 5,
  },
  chevron: {
    color: '#A78BFA',
    fontSize: 27,
    marginLeft: 8,
  },
  hint: {
    backgroundColor: '#312E81',
    borderRadius: 12,
    padding: 15,
    marginTop: 5,
  },
  hintText: {
    color: '#E0E7FF',
    fontSize: 13,
    lineHeight: 20,
  },
  demoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 310,
    marginTop: 25,
  },
  movable: {
    width: 110,
    height: 110,
    backgroundColor: '#7C3AED',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  movableText: {
    fontSize: 55,
    color: '#FFFFFF',
  },
  progressBackground: {
    width: '100%',
    height: 12,
    borderRadius: 10,
    backgroundColor: '#374151',
    overflow: 'hidden',
    marginTop: 25,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 10,
  },
  touchArea: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  multitouchFigure: {
    width: 100,
    height: 100,
    backgroundColor: '#0D9488',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bounceFigure: {
    width: 115,
    height: 115,
    borderRadius: 60,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  carouselCard: {
    height: 220,
    backgroundColor: '#4C1D95',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginRight: 0,
  },
  carouselEmoji: {
    fontSize: 55,
    marginBottom: 15,
  },
  carouselTitle: {
    fontSize: 23,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#6B7280',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 22,
    backgroundColor: '#A78BFA',
  },
  sensorEmoji: {
    fontSize: 75,
    marginBottom: 20,
  },
  sensorValues: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 25,
  },
  sensorText: {
    color: '#A78BFA',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
