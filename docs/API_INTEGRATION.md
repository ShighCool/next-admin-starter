# 后端对接指南

本文档介绍如何将 Next Admin Starter 与不同的后端服务对接。

## 目录

- [支持的后端技术](#支持的后端技术)
- [环境配置](#环境配置)
- [API 请求封装](#api-请求封装)
- [使用示例](#使用示例)
- [不同后端对接示例](#不同后端对接示例)

## 支持的后端技术

Next Admin Starter 可以与任何后端技术对接，包括但不限于：

- ✅ Go (Gin, Echo, Fiber 等)
- ✅ PHP (Laravel, ThinkPHP, Symfony 等)
- ✅ Java (Spring Boot, Vert.x 等)
- ✅ Python (Django, FastAPI, Flask 等)
- ✅ Node.js (Express, NestJS, Koa 等)
- ✅ Ruby (Rails)
- ✅ .NET (ASP.NET Core)

## 环境配置

### 1. 复制环境变量模板

```bash
cp .env.example .env.local
```

### 2. 配置 API 地址

编辑 `.env.local` 文件，设置你的后端 API 地址：

```bash
# Go 后端示例
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# PHP (Laravel) 后端示例
NEXT_PUBLIC_API_BASE_URL=http://localhost/api

# Java (Spring Boot) 后端示例
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Python (FastAPI) 后端示例
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## API 请求封装

项目已经封装了统一的请求工具 `src/utils/request.ts`，包含以下特性：

- 自动添加 Authorization 头（从 localStorage 读取 token）
- 统一的错误处理
- 请求/响应拦截器
- 超时控制（默认 30 秒）

### 使用方法

```typescript
import { request } from '@/utils/request';

// GET 请求
const users = await request.get('/users');

// POST 请求
const newUser = await request.post('/users', { name: '张三', email: 'zhang@example.com' });

// PUT 请求
const updatedUser = await request.put('/users/1', { name: '李四' });

// DELETE 请求
await request.delete('/users/1');
```

## 使用示例

### 1. 定义 API 接口

在 `src/api/` 目录下创建对应的 API 文件，例如 `user.ts`：

```typescript
import { request } from '@/utils/request';

export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
}

export const getUserList = (params: any) => {
  return request.get<{ list: User[]; total: number }>('/users', { params });
};

export const createUser = (data: Partial<User>) => {
  return request.post<User>('/users', data);
};

export const updateUser = (id: number, data: Partial<User>) => {
  return request.put<User>(`/users/${id}`, data);
};

export const deleteUser = (id: number) => {
  return request.delete(`/users/${id}`);
};
```

### 2. 在组件中使用

```typescript
'use client'

import { useState, useEffect } from 'react'
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUserList({ page: 1, pageSize: 10 })
      setUsers(data.list)
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 创建用户
  const handleCreate = async (values: any) => {
    try {
      await createUser(values)
      message.success('创建成功')
      fetchUsers()
    } catch (error) {
      message.error('创建失败')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div>
      {/* 你的组件内容 */}
    </div>
  )
}
```

## 不同后端对接示例

### Go (Gin)

**后端示例** (`main.go`):

```go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

type User struct {
    ID       int    `json:"id"`
    Name     string `json:"name"`
    Email    string `json:"email"`
    Status   string `json:"status"`
    Role     string `json:"role"`
}

func main() {
    r := gin.Default()

    // 添加 CORS 中间件
    r.Use(func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(http.StatusNoContent)
            return
        }

        c.Next()
    })

    api := r.Group("/api")
    {
        // 登录
        api.POST("/auth/login", loginHandler)

        // 用户管理
        api.GET("/users", getUsersHandler)
        api.POST("/users", createUserHandler)
        api.PUT("/users/:id", updateUserHandler)
        api.DELETE("/users/:id", deleteUserHandler)
    }

    r.Run(":8080")
}

func loginHandler(c *gin.Context) {
    // 登录逻辑
    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "data": gin.H{
            "token": "your-jwt-token",
            "user":  gin.H{"id": 1, "name": "管理员"},
        },
        "message": "登录成功",
    })
}

func getUsersHandler(c *gin.Context) {
    users := []User{
        {ID: 1, Name: "张三", Email: "zhang@example.com", Status: "active", Role: "user"},
        {ID: 2, Name: "李四", Email: "li@example.com", Status: "active", Role: "user"},
    }

    c.JSON(http.StatusOK, gin.H{
        "code": 200,
        "data": gin.H{
            "list":  users,
            "total": len(users),
        },
        "message": "获取成功",
    })
}
```

**前端配置** (`.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### PHP (Laravel)

**后端示例** (`routes/api.php`):

```php
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// 登录
Route::post('/auth/login', 'AuthController@login');

// 用户管理
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', 'UserController@index');
    Route::post('/users', 'UserController@store');
    Route::put('/users/{id}', 'UserController@update');
    Route::delete('/users/{id}', 'UserController@destroy');
});
```

**控制器示例** (`UserController.php`):

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::paginate($request->get('pageSize', 10));

        return response()->json([
            'code' => 200,
            'data' => [
                'list' => $users->items(),
                'total' => $users->total(),
            ],
            'message' => '获取成功'
        ]);
    }

    public function store(Request $request)
    {
        $user = User::create($request->all());

        return response()->json([
            'code' => 200,
            'data' => $user,
            'message' => '创建成功'
        ]);
    }
}
```

**前端配置** (`.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost/api
```

### Java (Spring Boot)

**后端示例** (`UserController.java`):

```java
package com.example.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int pageSize
    ) {
        List<User> users = userService.getUsers(page, pageSize);

        return ResponseEntity.ok(Map.of(
            "code", 200,
            "data", Map.of(
                "list", users,
                "total", users.size()
            ),
            "message", "获取成功"
        ));
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        User created = userService.createUser(user);
        return ResponseEntity.ok(Map.of(
            "code", 200,
            "data", created,
            "message", "创建成功"
        ));
    }
}
```

**前端配置** (`.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### Python (FastAPI)

**后端示例** (`main.py`):

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    id: int
    name: str
    email: str
    status: str
    role: str

@app.post("/api/auth/login")
async def login(username: str, password: str):
    return {
        "code": 200,
        "data": {
            "token": "your-jwt-token",
            "user": {"id": 1, "name": "管理员"}
        },
        "message": "登录成功"
    }

@app.get("/api/users")
async def get_users(page: int = 1, pageSize: int = 10):
    users = [
        User(id=1, name="张三", email="zhang@example.com", status="active", role="user"),
        User(id=2, name="李四", email="li@example.com", status="active", role="user"),
    ]

    return {
        "code": 200,
        "data": {
            "list": users,
            "total": len(users)
        },
        "message": "获取成功"
    }

@app.post("/api/users")
async def create_user(user: User):
    return {
        "code": 200,
        "data": user,
        "message": "创建成功"
    }
```

**前端配置** (`.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

## 部署说明

### 前端部署

前端项目可以部署到任何静态托管服务：

- Vercel
- Netlify
- GitHub Pages
- Nginx
- Apache

构建生产版本：

```bash
npm run build
```

部署 `build` 或 `.next` 目录。

### 后端部署

后端独立部署到不同的服务器：

- Go: 编译成二进制文件部署
- PHP: 部署到 PHP-FPM + Nginx
- Java: 打包成 JAR/WAR 部署
- Python: 使用 Gunicorn + Nginx 或 Docker

## 常见问题

### 1. CORS 错误

确保后端启用了 CORS，允许前端域名的跨域请求。

### 2. 401 未授权

检查 `localStorage` 中是否有 token，以及后端的 Authorization 头配置。

### 3. 请求超时

在 `src/utils/request.ts` 中调整 `timeout` 值。

### 4. 数据格式不匹配

根据后端返回的数据结构调整 `request.ts` 中的响应拦截器。

## 更多资源

- [Axios 文档](https://axios-http.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [跨域资源共享 (CORS)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
