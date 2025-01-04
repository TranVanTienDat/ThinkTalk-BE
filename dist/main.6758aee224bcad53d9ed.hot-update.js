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

/***/ "./src/entities/chat.entity.ts":
/*!*************************************!*\
  !*** ./src/entities/chat.entity.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Chat = exports.ChatStatus = void 0;\nconst typeorm_1 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst message_entity_1 = __webpack_require__(/*! ./message.entity */ \"./src/entities/message.entity.ts\");\nconst base_entity_1 = __webpack_require__(/*! ../common/entities/base.entity */ \"./src/common/entities/base.entity.ts\");\nconst chatMember_entity_1 = __webpack_require__(/*! ./chatMember.entity */ \"./src/entities/chatMember.entity.ts\");\nvar ChatStatus;\n(function (ChatStatus) {\n    ChatStatus[\"Pr\"] = \"private\";\n    ChatStatus[\"Gr\"] = \"group\";\n})(ChatStatus || (exports.ChatStatus = ChatStatus = {}));\nlet Chat = class Chat extends base_entity_1.BaseEntity {\n};\nexports.Chat = Chat;\n__decorate([\n    (0, typeorm_1.Column)({ name: 'name', nullable: false, default: null }),\n    __metadata(\"design:type\", String)\n], Chat.prototype, \"name\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({\n        type: 'enum',\n        enum: ChatStatus,\n        default: ChatStatus.Pr,\n    }),\n    __metadata(\"design:type\", String)\n], Chat.prototype, \"type\", void 0);\n__decorate([\n    (0, typeorm_1.Column)({ name: 'avatar', nullable: false, default: null }),\n    __metadata(\"design:type\", String)\n], Chat.prototype, \"avatar\", void 0);\n__decorate([\n    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, (m) => m.chat, { onDelete: 'CASCADE' }),\n    __metadata(\"design:type\", Array)\n], Chat.prototype, \"messages\", void 0);\n__decorate([\n    (0, typeorm_1.OneToMany)(() => chatMember_entity_1.ChatMember, (c) => c.chat, { onDelete: 'CASCADE' }),\n    __metadata(\"design:type\", Array)\n], Chat.prototype, \"chatMembers\", void 0);\nexports.Chat = Chat = __decorate([\n    (0, typeorm_1.Entity)({ name: 'chat' })\n], Chat);\n\n\n//# sourceURL=webpack://learn-project/./src/entities/chat.entity.ts?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("42297d72bb81d7d7c6c6")
/******/ })();
/******/ 
/******/ }
;