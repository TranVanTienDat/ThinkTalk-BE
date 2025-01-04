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

/***/ "./src/modules/chat/dto/create-chat.dto.ts":
/*!*************************************************!*\
  !*** ./src/modules/chat/dto/create-chat.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\n};\nvar __metadata = (this && this.__metadata) || function (k, v) {\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(k, v);\n};\nvar _a;\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CreateChatDto = exports.ChatMemberDto = void 0;\nconst class_validator_1 = __webpack_require__(/*! class-validator */ \"class-validator\");\nconst class_transformer_1 = __webpack_require__(/*! class-transformer */ \"class-transformer\");\nconst chatMember_entity_1 = __webpack_require__(/*! ../../../entities/chatMember.entity */ \"./src/entities/chatMember.entity.ts\");\nconst swagger_1 = __webpack_require__(/*! @nestjs/swagger */ \"@nestjs/swagger\");\nclass ChatMemberDto {\n    constructor() {\n        this.role = chatMember_entity_1.ChatRole.MEMBER;\n    }\n}\nexports.ChatMemberDto = ChatMemberDto;\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: 'userId', example: '123' }),\n    (0, class_validator_1.IsNotEmpty)(),\n    __metadata(\"design:type\", String)\n], ChatMemberDto.prototype, \"userId\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: 'role', example: 'admin' }),\n    (0, class_validator_1.IsEnum)(chatMember_entity_1.ChatRole),\n    (0, class_validator_1.IsOptional)(),\n    __metadata(\"design:type\", String)\n], ChatMemberDto.prototype, \"role\", void 0);\nclass CreateChatDto {\n    constructor() {\n        this.type = chatMember_entity_1.ChatStatus.Pr;\n    }\n}\nexports.CreateChatDto = CreateChatDto;\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: 'name', example: 'Group' }),\n    (0, class_validator_1.IsString)(),\n    (0, class_validator_1.IsNotEmpty)(),\n    __metadata(\"design:type\", String)\n], CreateChatDto.prototype, \"name\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({ description: 'type', example: 'private', default: 'group' }),\n    (0, class_validator_1.IsEnum)(chatMember_entity_1.ChatStatus),\n    (0, class_validator_1.IsOptional)(),\n    __metadata(\"design:type\", typeof (_a = typeof chatMember_entity_1.ChatStatus !== \"undefined\" && chatMember_entity_1.ChatStatus) === \"function\" ? _a : Object)\n], CreateChatDto.prototype, \"type\", void 0);\n__decorate([\n    (0, swagger_1.ApiProperty)({\n        description: 'avatar',\n        example: [{ userId: '123', role: 'member' }],\n    }),\n    (0, class_validator_1.IsArray)(),\n    (0, class_validator_1.ValidateNested)({ each: true }),\n    (0, class_transformer_1.Type)(() => ChatMemberDto),\n    __metadata(\"design:type\", Array)\n], CreateChatDto.prototype, \"chatMembers\", void 0);\n\n\n//# sourceURL=webpack://learn-project/./src/modules/chat/dto/create-chat.dto.ts?");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("99b2260e6e97177317cb")
/******/ })();
/******/ 
/******/ }
;