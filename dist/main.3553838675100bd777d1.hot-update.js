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

/***/ "./src/modules/chat/chat.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/chat/chat.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChatModule = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst chat_service_1 = __webpack_require__(/*! ./chat.service */ \"./src/modules/chat/chat.service.ts\");\nconst chat_controller_1 = __webpack_require__(/*! ./chat.controller */ \"./src/modules/chat/chat.controller.ts\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst chat_entity_1 = __webpack_require__(/*! ../../entities/chat.entity */ \"./src/entities/chat.entity.ts\");\nconst chatMember_entity_1 = __webpack_require__(/*! ../../entities/chatMember.entity */ \"./src/entities/chatMember.entity.ts\");\nlet ChatModule = class ChatModule {\n};\nexports.ChatModule = ChatModule;\nexports.ChatModule = ChatModule = __decorate([\n    (0, common_1.Module)({\n        imports: [typeorm_1.TypeOrmModule.forFeature([chat_entity_1.Chat, chatMember_entity_1.ChatMember])],\n        controllers: [chat_controller_1.ChatController],\n        providers: [chat_service_1.ChatService],\n    })\n], ChatModule);\n\n\n//# sourceURL=webpack://learn-project/./src/modules/chat/chat.module.ts?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("d09e4be1adadfa66d57f")
/******/ })();
/******/ 
/******/ }
;