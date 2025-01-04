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

/***/ "./src/entities/index.ts":
/*!*******************************!*\
  !*** ./src/entities/index.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Attachment = exports.Chat = exports.ChatMember = exports.Device = exports.Message = exports.MessageStatus = exports.Notification = exports.User = void 0;\nvar user_entity_1 = __webpack_require__(/*! ./user.entity */ \"./src/entities/user.entity.ts\");\nObject.defineProperty(exports, \"User\", ({ enumerable: true, get: function () { return user_entity_1.User; } }));\nvar notification_entity_1 = __webpack_require__(/*! ./notification.entity */ \"./src/entities/notification.entity.ts\");\nObject.defineProperty(exports, \"Notification\", ({ enumerable: true, get: function () { return notification_entity_1.Notification; } }));\nvar messageStatus_entity_1 = __webpack_require__(/*! ./messageStatus.entity */ \"./src/entities/messageStatus.entity.ts\");\nObject.defineProperty(exports, \"MessageStatus\", ({ enumerable: true, get: function () { return messageStatus_entity_1.MessageStatus; } }));\nvar message_entity_1 = __webpack_require__(/*! ./message.entity */ \"./src/entities/message.entity.ts\");\nObject.defineProperty(exports, \"Message\", ({ enumerable: true, get: function () { return message_entity_1.Message; } }));\nvar devices_entity_1 = __webpack_require__(/*! ./devices.entity */ \"./src/entities/devices.entity.ts\");\nObject.defineProperty(exports, \"Device\", ({ enumerable: true, get: function () { return devices_entity_1.Device; } }));\nvar chatMember_entity_1 = __webpack_require__(/*! ./chatMember.entity */ \"./src/entities/chatMember.entity.ts\");\nObject.defineProperty(exports, \"ChatMember\", ({ enumerable: true, get: function () { return chatMember_entity_1.ChatMember; } }));\nvar chat_entity_1 = __webpack_require__(/*! ./chat.entity */ \"./src/entities/chat.entity.ts\");\nObject.defineProperty(exports, \"Chat\", ({ enumerable: true, get: function () { return chat_entity_1.Chat; } }));\nvar attachment_entity_1 = __webpack_require__(/*! ./attachment.entity */ \"./src/entities/attachment.entity.ts\");\nObject.defineProperty(exports, \"Attachment\", ({ enumerable: true, get: function () { return attachment_entity_1.Attachment; } }));\n\n\n//# sourceURL=webpack://learn-project/./src/entities/index.ts?");

/***/ }),

/***/ "./src/modules/chat/chat.service.ts":
/*!******************************************!*\
  !*** ./src/modules/chat/chat.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar __param = (this && this.__param) || function (paramIndex, decorator) {\n    return function (target, key) { decorator(target, key, paramIndex); }\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ChatService = void 0;\nconst common_1 = __webpack_require__(/*! @nestjs/common */ \"@nestjs/common\");\nconst typeorm_1 = __webpack_require__(/*! @nestjs/typeorm */ \"@nestjs/typeorm\");\nconst typeorm_2 = __webpack_require__(/*! typeorm */ \"typeorm\");\nconst entities_1 = __webpack_require__(/*! ../../entities */ \"./src/entities/index.ts\");\nlet ChatService = class ChatService {\n    constructor(chatRepository, chatMemberRepository) {\n        this.chatRepository = chatRepository;\n        this.chatMemberRepository = chatMemberRepository;\n    }\n    async create(createChatDto) {\n        const { name, type, chatMembers } = createChatDto;\n        const chat = this.chatRepository.create({\n            name,\n            type,\n            createdAt: new Date(),\n        });\n        const savedChat = await this.chatRepository.save(chat);\n        const members = chatMembers.map((member) => {\n            return this.chatMemberRepository.create({\n                user: { id: member.userId },\n                chat: savedChat,\n                role: member.role,\n                createdAt: new Date(),\n            });\n        });\n        await this.chatMemberRepository.save(members);\n        return this.chatRepository.findOne({\n            where: { id: savedChat.id },\n            relations: ['chatMembers'],\n        });\n    }\n    findAll() {\n        return `This action returns all chat`;\n    }\n    findOne(id) {\n        return `This action returns a #${id} chat`;\n    }\n    async update(id, updateChatDto) {\n        const chat = await this.chatRepository.findOneBy({ id });\n        if (!chat) {\n            throw new common_1.NotFoundException('Chat not found');\n        }\n        Object.assign(chat, updateChatDto);\n        const updatedChat = await this.chatRepository.save(chat);\n        return updatedChat;\n    }\n    async remove(id) {\n        const chat = await this.chatRepository.findOneBy({ id });\n        if (!chat) {\n            throw new common_1.NotFoundException('Chat not found');\n        }\n        const updatedChat = await this.chatRepository.delete(chat);\n        return updatedChat;\n    }\n    async addMembersToChat(userIds, chatId, role = ChatRole.MEMBER) {\n        const chat = await this.chatRepository.findOneBy({ id: chatId });\n        if (!chat) {\n            throw new Error('Chat not found');\n        }\n        const chatMembers = userIds.map((userId) => {\n            const chatMember = this.chatMemberRepository.create({\n                user: { id: userId },\n                chat,\n                role,\n            });\n            return chatMember;\n        });\n        console.log('chatMembers', chatMembers);\n        return await this.chatMemberRepository.save(chatMembers);\n    }\n    async removeMemberFromChat(userId, chatId) {\n        const chatMember = await this.chatMemberRepository.findOne({\n            where: { user: { id: userId }, chat: { id: chatId } },\n        });\n        if (!chatMember) {\n            throw new Error('Chat member not found');\n        }\n        return await this.chatMemberRepository.remove(chatMember);\n    }\n};\nexports.ChatService = ChatService;\nexports.ChatService = ChatService = __decorate([\n    (0, common_1.Injectable)(),\n    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Chat)),\n    __param(1, (0, typeorm_1.InjectRepository)(entities_1.ChatMember)),\n    __metadata(\"design:paramtypes\", [typeorm_2.Repository,\n        typeorm_2.Repository])\n], ChatService);\n\n\n//# sourceURL=webpack://learn-project/./src/modules/chat/chat.service.ts?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("2f2c845c9e24265abd1b")
/******/ })();
/******/ 
/******/ }
;