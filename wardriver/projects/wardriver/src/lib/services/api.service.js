"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ApiService = void 0;
var core_1 = require("@angular/core");
var ApiService = /** @class */ (function () {
    function ApiService(http, router) {
        this.http = http;
        this.router = router;
        this.apiModuleBusy = document.getElementById('ApiModuleBusy');
        this.emptyResponse = { error: 'Request returned empty response' };
    }
    ApiService_1 = ApiService;
    ApiService.prototype.unauth = function () {
        localStorage.removeItem('authToken');
        if (this.router.url !== '/Login' && this.router.url !== '/Setup') {
            this.router.navigateByUrl('/Login');
        }
    };
    ApiService.prototype.setBusy = function () {
        this.apiModuleBusy.style.display = 'block';
    };
    ApiService.prototype.setNotBusy = function () {
        this.apiModuleBusy.style.display = 'none';
    };
    ApiService.prototype.request = function (payload, callback) {
        var _this = this;
        this.setBusy();
        var resp;
        this.http.post('/api/module/request', payload).subscribe(function (r) {
            if (r === undefined || r === null) {
                resp = _this.emptyResponse;
            }
            else if (r.error) {
                resp = r;
            }
            else {
                resp = r.payload;
            }
        }, function (err) {
            resp = err.error;
            if (err.status === 401) {
                _this.unauth();
            }
            _this.setNotBusy();
            callback(resp);
        }, function () {
            _this.setNotBusy();
            callback(resp);
        });
        ApiService_1.totalRequests++;
    };
    ApiService.prototype.APIGet = function (path, callback) {
        var _this = this;
        ApiService_1.totalRequests++;
        var resp;
        this.http.get(path).subscribe(function (r) {
            if (r === undefined || r === null) {
                r = _this.emptyResponse;
            }
            resp = r;
        }, function (err) {
            resp = err.error;
            if (err.status === 401) {
                _this.unauth();
            }
            callback(resp);
        }, function () {
            callback(resp);
        });
    };
    ApiService.prototype.APIGetAsync = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ApiService_1.totalRequests++;
                        return [4 /*yield*/, this.http.get(path).toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiService.prototype.APIPut = function (path, body, callback) {
        var _this = this;
        ApiService_1.totalRequests++;
        var resp;
        this.http.put(path, body).subscribe(function (r) {
            if (r === undefined || r === null) {
                r = _this.emptyResponse;
            }
            resp = r;
        }, function (err) {
            resp = err.error;
            if (err.status === 401) {
                _this.unauth();
            }
            callback(resp);
        }, function () {
            callback(resp);
        });
    };
    ApiService.prototype.APIPutAsync = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.put(path, body).toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiService.prototype.APIPost = function (path, body, callback) {
        var _this = this;
        ApiService_1.totalRequests++;
        var resp;
        this.http.post(path, body).subscribe(function (r) {
            if (r === undefined || r === null) {
                resp = _this.emptyResponse;
            }
            resp = r;
        }, function (err) {
            resp = err.error;
            if (err.status === 401) {
                _this.unauth();
            }
            callback(resp);
        }, function () {
            callback(resp);
        });
    };
    ApiService.prototype.APIPostAsync = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http.post(path, body).toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiService.prototype.APIDelete = function (path, body, callback) {
        var _this = this;
        ApiService_1.totalRequests++;
        var opts = {
            headers: null,
            body: body
        };
        var resp;
        this.http["delete"](path, opts).subscribe(function (r) {
            if (r === undefined || r === null) {
                r = _this.emptyResponse;
            }
            resp = r;
        }, function (err) {
            resp = err.error;
            if (err.status === 401) {
                _this.unauth();
            }
            callback(resp);
        }, function () {
            callback(resp);
        });
    };
    ApiService.prototype.APIDeleteAsync = function (path, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.http["delete"](path, body).toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ApiService.prototype.APIDownload = function (fullpath, filename) {
        ApiService_1.totalRequests++;
        var body = {
            filename: fullpath
        };
        this.http.post('/api/download', body, { responseType: 'blob' }).subscribe(function (r) {
            var url = window.URL.createObjectURL(r);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        });
    };
    var ApiService_1;
    ApiService.totalRequests = 0;
    ApiService = ApiService_1 = __decorate([
        (0, core_1.Injectable)({
            providedIn: 'root'
        })
    ], ApiService);
    return ApiService;
}());
exports.ApiService = ApiService;
