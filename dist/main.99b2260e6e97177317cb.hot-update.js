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

/***/ "./src/modules/users/users.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.UsersModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst users_controller_1 = __webpack_require__(/*! ./users.controller */ \"./src/modules/users/users.controller.ts\");\nconst users_service_1 = __webpack_require__(/*! ./users.service */ \"./src/modules/users/users.service.ts\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst user_entity_1 = __webpack_require__(/*! ../../entities/user.entity */ \"./src/entities/user.entity.ts\");\nlet UsersModule = class UsersModule {\n};\nexports.UsersModule = UsersModule;\nexports.UsersModule = UsersModule = __decorate([\n    (0, common_1.Module)({\n        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],\n        controllers: [users_controller_1.UsersController],\n        providers: [users_service_1.UsersService],\n        exports: [users_service_1.UsersService],\n    })\n], UsersModule);\n\n\n//# sourceURL=webpack://learn-project/./src/modules/users/users.module.ts?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("a679b8b60a1f03af43a1")
/******/ })();
/******/ 
/******/ }
;