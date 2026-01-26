"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let ToolsController = class ToolsController {
    getLoginPage() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Swagger Login Helper</title>
                <style>
                    body { font-family: monospace; padding: 20px; background: #f0f0f0; }
                    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    h1 { color: #333; margin-top: 0; }
                    button { background: #4285F4; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-size: 16px; }
                    button:hover { background: #357abd; }
                    #token-area { margin-top: 20px; display: none; }
                    textarea { width: 100%; height: 150px; font-family: monospace; border: 1px solid #ccc; border-radius: 4px; padding: 10px; box-sizing: border-box; }
                    .copy-btn { background: #34A853; margin-top: 10px; }
                    .copy-btn:hover { background: #2d8c45; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Swagger Login Helper</h1>
                    <p>Sign in with Google to generate a Firebase ID Token for Swagger Authorization.</p>
                    <button id="login-btn">Sign in with Google</button>
                    
                    <div id="token-area">
                        <p><strong>Your ID Token:</strong></p>
                        <textarea id="token-box" readonly></textarea>
                        <button class="copy-btn" onclick="copyToken()">Copy Token</button>
                        <p><small style="color: #666">Paste this into the Swagger "Authorize" box (type: Bearer &lt;token&gt;)</small></p>
                    </div>
                </div>

                <script type="module">
                    import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
                    import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

                    const firebaseConfig = {
                        apiKey: "AIzaSyAnVr5QyMUxWmQ3Pu_EpKPuDRuT851MqzI",
                        authDomain: "test-liste-envies.firebaseapp.com",
                        projectId: "test-liste-envies",
                        storageBucket: "test-liste-envies.appspot.com",
                        messagingSenderId: "424684618174",
                        appId: "1:424684618174:web:..." // Optional if needed, usually not strictly required for Auth only
                    };

                    const app = initializeApp(firebaseConfig);
                    const auth = getAuth(app);
                    const provider = new GoogleAuthProvider();

                    document.getElementById('login-btn').addEventListener('click', () => {
                        signInWithPopup(auth, provider)
                            .then((result) => {
                                return result.user.getIdToken();
                            })
                            .then((token) => {
                                document.getElementById('token-area').style.display = 'block';
                                document.getElementById('token-box').value = token;
                            })
                            // })
                            .catch((error) => {
                                alert('Error: ' + error.message);
                                console.error('Login error:', error);
                            });
                    });

                    window.copyToken = function() {
                        const copyText = document.getElementById("token-box");
                        copyText.select();
                        copyText.setSelectionRange(0, 99999); 
                        navigator.clipboard.writeText(copyText.value);
                        alert("Token copied!");
                    }
                </script>
            </body>
            </html>
        `;
    }
};
exports.ToolsController = ToolsController;
__decorate([
    (0, common_1.Get)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Helper page to get Firebase ID Token' }),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], ToolsController.prototype, "getLoginPage", null);
exports.ToolsController = ToolsController = __decorate([
    (0, swagger_1.ApiTags)('Tools'),
    (0, common_1.Controller)('tools')
], ToolsController);
//# sourceMappingURL=tools.controller.js.map