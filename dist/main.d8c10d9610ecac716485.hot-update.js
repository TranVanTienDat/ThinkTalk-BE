"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "main";
exports.ids = null;
exports.modules = {

/***/ "./src/database/database.module.ts":
/*!*****************************************!*\
  !*** ./src/database/database.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DatabaseModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst config_1 = __webpack_require__(/*! @nestjs/config */ \"@nestjs/config\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst path = __importStar(__webpack_require__(/*! path */ \"path\"));\nlet DatabaseModule = class DatabaseModule {\n};\nexports.DatabaseModule = DatabaseModule;\nexports.DatabaseModule = DatabaseModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            config_1.ConfigModule,\n            typeorm_1.TypeOrmModule.forRootAsync({\n                imports: [config_1.ConfigModule],\n                inject: [config_1.ConfigService],\n                useFactory: (configService) => {\n                    return {\n                        type: 'postgres',\n                        url: configService.get('DATABASE_URL'),\n                        entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],\n                        autoLoadEntities: true,\n                        synchronize: true,\n                    };\n                },\n            }),\n        ],\n    })\n], DatabaseModule);\n\n\n//# sourceURL=webpack://learn-project/./src/database/database.module.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst core_1 = __webpack_require__(/*! @nestjs/core */ \"@nestjs/core\");\nconst app_module_1 = __webpack_require__(/*! ./app.module */ \"./src/app.module.ts\");\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nconst SWAGGER_TITLE = 'Chat app API';\nconst SWAGGER_DESCRIPTION = 'API used for Chat app management';\nconst SWAGGER_PREFIX = '/docs';\nfunction createSwagger(app) {\n    const config = new swagger_1.DocumentBuilder()\n        .setTitle(SWAGGER_TITLE)\n        .setDescription(SWAGGER_DESCRIPTION)\n        .addBearerAuth()\n        .build();\n    const document = () => swagger_1.SwaggerModule.createDocument(app, config);\n    swagger_1.SwaggerModule.setup(SWAGGER_PREFIX, app, document, {\n        customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',\n        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',\n        customJs: [\n            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',\n            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',\n        ],\n    });\n}\nasync function bootstrap() {\n    const app = await core_1.NestFactory.create(app_module_1.AppModule);\n    app.setGlobalPrefix('/api/v1/');\n    if (!process.env.SWAGGER_ENABLE || process.env.SWAGGER_ENABLE === '1') {\n        createSwagger(app);\n    }\n    app.enableCors({ origin: '*' });\n    app.useGlobalPipes(new common_1.ValidationPipe());\n    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });\n    await app.listen(3000);\n}\nbootstrap();\n\n\n//# sourceURL=webpack://learn-project/./src/main.ts?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("ed1b5c9a48520b3be33e")
/******/ })();
/******/ 
/******/ }
;