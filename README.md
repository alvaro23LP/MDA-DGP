# MDA-DGP
Repositorio del proyecto desarrollado en MDA y DGP en la UGR.


## **COMANDOS ÚTILES:**

- Iniciar la aplicación ```npx expo start```
- Iniciar la aplicación borrando cache de Metro Bundler ```npx expo start --clear```
- Instalar todas las depencias ```npm install```
- Instalación limpia ```rm -rf node_modules/``` y **SOLO en caso de haber actualizaciado las dependencias en *package.json* Y SI LO ANTERIOR NO FUNCIONA** ```rm -rf package-lock.json```  ---> Tras esto hacer ```npm install```
- Agrupar todas las funciones de acceso a la BD en un solo archivo
- Lanzar en emulador con la cli: ```emulator -avd Medium_Tablet_API_35``` (añadir emulator al PATH previamente)


## **CAMBIOS PENDIENTES:**

- Incluir archivo de configuracion de firebase en gitignore
- Arreglar splashScreen -- "Created"
- Arreglar Aviso de constraseña exitosa/fallida en login de estudiantes
- Poner el nombre debajo de cada foto de usuario en la pantalla de inicio




- Cambiar jerarquia de archivos? sugerida:

```
MyReactNativeApp/
├── node_modules/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── fonts/
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   └── SettingsScreen.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── styles/                     --- css de colores, estilos...
│   │   └── globalStyles.js
│   ├── utils/                      --- funciones o utilidades que se usan en varias partes del proyecto...
│   │   └── constants.js
│   └── services/                   --- lógica para interacciones externas, como solicitudes HTTP
│       └── api.js
├── App.js
├── babel.config.js
├── metro.config.js
├── package.json
└── README.md
```


