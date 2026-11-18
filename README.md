# Animaciones Interactivas — React Native + Expo

Aplicación académica que integra seis ejercicios de animación y gestos, más un menú lateral Drawer Navigation.

## Requisitos

- Node.js LTS (recomendado).
- npm.
- Expo Go en un teléfono Android/iOS o un emulador Android configurado.
- Conexión a internet para descargar dependencias y la fotografía del ejercicio multitáctil.

## Instalación y ejecución

1. Descomprime el proyecto.
2. Abre la carpeta `Expo_Animaciones_Interactives` en Visual Studio Code.
3. Abre una terminal dentro de esa carpeta.
4. Ejecuta:

```bash
npm install
npx expo install --fix
npx expo start
```

5. Para abrirlo en Android, instala Expo Go en el teléfono y escanea el QR que aparece en la terminal. También puedes pulsar `a` si tienes un emulador Android configurado.

Si Expo indica que alguna dependencia nativa no coincide con el SDK, ejecuta:

```bash
npx expo install
npx expo start -c
```

## Ejercicios incluidos

1. **Arrastrar y rotar:** gesto Pan con rotación proporcional al desplazamiento horizontal y retorno con resorte.
2. **Animación de carga:** spinner y barra de progreso en bucle infinito al montar la pantalla.
3. **Gestos multitáctiles:** Pan, Pinch y Rotation simultáneos sobre una imagen.
4. **Efecto rebote:** compresión al presionar y retorno con `withSpring`.
5. **Carrusel animado:** desplazamiento horizontal con snap, escala y rotación según la distancia al centro.
6. **Acelerómetro:** usa `expo-sensors` para detectar sacudidas del dispositivo y activar la animación.
7. **Drawer Navigation:** menú lateral con acceso independiente a cada pantalla.

## Notas importantes

- El acelerómetro debe probarse preferiblemente en un teléfono físico. Un emulador puede no proporcionar datos reales del sensor.
- El ejercicio multitáctil descarga una imagen de Unsplash; requiere internet. Puedes reemplazar la URL por una imagen local si lo necesitas.
- Reanimated 4 utiliza `react-native-worklets`; por eso Babel incluye `react-native-worklets/plugin` como último plugin.
- Este proyecto usa Expo administrado. No es necesario ejecutar `npx react-native run-android`.

## Publicar en GitHub

Crea un repositorio **público** en https://github.com/new. No marques la opción de crear README porque este proyecto ya incluye uno.

Luego, desde la terminal ubicada en la carpeta del proyecto, ejecuta:

```bash
git init
git add .
git commit -m "Proyecto de animaciones con React Native y Expo"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

Sustituye `TU-USUARIO` y `TU-REPOSITORIO` por los datos reales de tu cuenta y repositorio.

## Tecnologías

- React Native
- Expo
- React Native Reanimated
- React Native Gesture Handler
- React Navigation Drawer
- Expo Sensors (Accelerometer)
