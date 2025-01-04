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

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DatabaseModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst config_1 = __webpack_require__(/*! @nestjs/config */ \"@nestjs/config\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nlet DatabaseModule = class DatabaseModule {\n};\nexports.DatabaseModule = DatabaseModule;\nexports.DatabaseModule = DatabaseModule = __decorate([\n    (0, common_1.Module)({\n        imports: [\n            config_1.ConfigModule,\n            typeorm_1.TypeOrmModule.forRootAsync({\n                imports: [config_1.ConfigModule],\n                inject: [config_1.ConfigService],\n                useFactory: (configService) => {\n                    return {\n                        type: 'postgres',\n                        url: configService.get('DATABASE_URL'),\n                        entities: ['dist/entity/**/*.js'],\n                        autoLoadEntities: true,\n                        synchronize: true,\n                    };\n                },\n            }),\n        ],\n    })\n], DatabaseModule);\n\n\n//# sourceURL=webpack://learn-project/./src/database/database.module.ts?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("fe52a7ff3325e7e68c87")
/******/ })();
/******/ 
/******/ }
;