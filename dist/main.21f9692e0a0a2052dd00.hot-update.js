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

/***/ "./src/modules/chat/chat.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/chat/chat.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChatController = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst chat_service_1 = __webpack_require__(/*! ./chat.service */ \"./src/modules/chat/chat.service.ts\");\nconst create_chat_dto_1 = __webpack_require__(/*! ./dto/create-chat.dto */ \"./src/modules/chat/dto/create-chat.dto.ts\");\nconst update_chat_dto_1 = __webpack_require__(/*! ./dto/update-chat.dto */ \"./src/modules/chat/dto/update-chat.dto.ts\");\nconst chatMember_entity_1 = __webpack_require__(/*! ../../entities/chatMember.entity */ \"./src/entities/chatMember.entity.ts\");\nlet ChatController = class ChatController {\n    constructor(chatService) {\n        this.chatService = chatService;\n    }\n    create(createChatDto) {\n        return this.chatService.create(createChatDto);\n    }\n    findAll() {\n        return this.chatService.findAll();\n    }\n    findOne(id) {\n        return this.chatService.findOne(id);\n    }\n    update(id, updateChatDto) {\n        return this.chatService.update(id, updateChatDto);\n    }\n    remove(id) {\n        return this.chatService.remove(id);\n    }\n    async addMembersToChat(chatId, userIds, role = chatMember_entity_1.ChatRole.MEMBER) {\n        return await this.chatService.addMembersToChat(userIds, chatId, role);\n    }\n    async removeMemberFromChat(chatId, userId) {\n        return await this.chatService.removeMemberFromChat(userId, chatId);\n    }\n};\nexports.ChatController = ChatController;\n__decorate([\n    (0, common_1.Post)(),\n    __param(0, (0, common_1.Body)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [create_chat_dto_1.CreateChatDto]),\n    __metadata(\"design:returntype\", void 0)\n], ChatController.prototype, \"create\", null);\n__decorate([\n    (0, common_1.Get)(),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", []),\n    __metadata(\"design:returntype\", void 0)\n], ChatController.prototype, \"findAll\", null);\n__decorate([\n    (0, common_1.Get)(':id'),\n    __param(0, (0, common_1.Param)('id')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", void 0)\n], ChatController.prototype, \"findOne\", null);\n__decorate([\n    (0, common_1.Put)(':id'),\n    __param(0, (0, common_1.Param)('id')),\n    __param(1, (0, common_1.Body)()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, update_chat_dto_1.UpdateChatDto]),\n    __metadata(\"design:returntype\", void 0)\n], ChatController.prototype, \"update\", null);\n__decorate([\n    (0, common_1.Delete)(':id'),\n    __param(0, (0, common_1.Param)('id')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String]),\n    __metadata(\"design:returntype\", void 0)\n], ChatController.prototype, \"remove\", null);\n__decorate([\n    (0, common_1.Post)(':chatId/members'),\n    __param(0, (0, common_1.Param)('chatId')),\n    __param(1, (0, common_1.Body)('userIds')),\n    __param(2, (0, common_1.Body)('role')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, Array, String]),\n    __metadata(\"design:returntype\", Promise)\n], ChatController.prototype, \"addMembersToChat\", null);\n__decorate([\n    (0, common_1.Delete)(':chatId/members/:userId'),\n    __param(0, (0, common_1.Param)('chatId')),\n    __param(1, (0, common_1.Param)('userId')),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [String, String]),\n    __metadata(\"design:returntype\", Promise)\n], ChatController.prototype, \"removeMemberFromChat\", null);\nexports.ChatController = ChatController = __decorate([\n    (0, common_1.Controller)('chat'),\n    __metadata(\"design:paramtypes\", [chat_service_1.ChatService])\n], ChatController);\n\n\n//# sourceURL=webpack://learn-project/./src/modules/chat/chat.controller.ts?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("3553838675100bd777d1")
/******/ })();
/******/ 
/******/ }
;