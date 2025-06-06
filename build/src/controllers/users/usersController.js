"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRecovery = exports.signIn = exports.signUp = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users = [];
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || email === undefined) {
            return res.status(400).send('Email is required');
        }
        if (!password || password === undefined) {
            return res.status(400).send('Password is required');
        }
        const hashedPassword = yield bcrypt.hash(password, 12);
        const newUser = { email: email, password: hashedPassword };
        users.push(newUser);
        res.status(201).send('User created');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = users.find((u) => u.email === email);
        if (user && (yield bcrypt.compare(password, user.password))) {
            const token = jsonwebtoken_1.default.sign({ email: user.email }, 'secret_key');
            res.json({ token });
        }
        else {
            res.status(401).send('Invalid credentials');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
exports.signIn = signIn;
const passwordRecovery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        const user = users.find(u => u.email === email);
        if (user) {
            user.password = yield bcrypt.hash(newPassword, 10);
            res.send('Password updated');
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
exports.passwordRecovery = passwordRecovery;
//# sourceMappingURL=usersController.js.map