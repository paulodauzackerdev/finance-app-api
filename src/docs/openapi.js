export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Finance App API',
    version: '1.0.2',
    description: 'API para gerenciamento financeiro pessoal com autenticação JWT, refresh token e RBAC'
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Servidor de desenvolvimento'
    }
  ],
  tags: [
    { name: 'Auth', description: 'Autenticação JWT' },
    { name: 'Users', description: 'Gerenciamento de usuários' },
    { name: 'Transactions', description: 'Gerenciamento de transações' }
  ],
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Realizar login',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          429: { $ref: '#/components/responses/TooManyRequests' }
        }
      }
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Renovar access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Tokens renovados com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/RefreshTokenResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          429: { $ref: '#/components/responses/TooManyRequests' }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Realizar logout',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Logout realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Logged out successfully'
                    }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' }
        }
      }
    },
    '/api/users': {
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Listar todos os usuários (admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de usuários',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/UserResponse' }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' }
        }
      },
      post: {
        tags: ['Users'],
        summary: 'Criar um novo usuário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Usuário criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserResponse' }
              }
            }
          },
          400: { $ref: '#/components/responses/ValidationError' },
          409: { $ref: '#/components/responses/ConflictError' },
          429: { $ref: '#/components/responses/TooManyRequests' }
        }
      }
    },
    '/api/users/deleted': {
      get: {
        tags: ['Users'],
        summary: 'Listar usuários deletados (soft delete)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de usuários deletados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/DeletedUserResponse' }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' }
        }
      }
    },
    '/api/users/email/{email}': {
      get: {
        tags: ['Users'],
        summary: 'Buscar usuário por email (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'email',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'email' }
          }
        ],
        responses: {
          200: {
            description: 'Usuário encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Buscar usuário por ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Usuário encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      },
      patch: {
        tags: ['Users'],
        summary: 'Atualizar usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Usuário atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserResponse' }
              }
            }
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' },
          409: { $ref: '#/components/responses/ConflictError' }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Soft delete de usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Usuário deletado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'User deleted successfully'
                    },
                    user: { $ref: '#/components/schemas/UserResponse' }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/users/{id}/hard': {
      delete: {
        tags: ['Users'],
        summary: 'Hard delete de usuário (remoção permanente)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Usuário removido permanentemente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'User permanently deleted successfully'
                    },
                    user: { $ref: '#/components/schemas/UserResponse' }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/users/{id}/restore': {
      patch: {
        tags: ['Users'],
        summary: 'Restaurar usuário deletado',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Usuário restaurado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'User restored successfully'
                    },
                    user: { $ref: '#/components/schemas/UserResponse' }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/users/{id}/balance': {
      get: {
        tags: ['Users'],
        summary: 'Obter saldo do usuário',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Saldo do usuário',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BalanceResponse' }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'Listar transações do usuário autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de transações',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/TransactionResponse' }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' }
        }
      },
      post: {
        tags: ['Transactions'],
        summary: 'Criar uma nova transação',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTransactionInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Transação criada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Transaction created successfully'
                    },
                    transaction: {
                      $ref: '#/components/schemas/TransactionResponse'
                    }
                  }
                }
              }
            }
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/UnauthorizedError' }
        }
      }
    },
    '/api/transactions/deleted': {
      get: {
        tags: ['Transactions'],
        summary: 'Listar todas as transações deletadas (admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de transações deletadas',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/DeletedTransactionResponse'
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' }
        }
      }
    },
    '/api/transactions/deleted/{userId}': {
      get: {
        tags: ['Transactions'],
        summary: 'Listar transações deletadas de um usuário específico (admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Lista de transações deletadas do usuário',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/DeletedTransactionResponse'
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions/{id}': {
      patch: {
        tags: ['Transactions'],
        summary: 'Atualizar transação',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTransactionInput' }
            }
          }
        },
        responses: {
          200: {
            description: 'Transação atualizada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Transaction updated successfully'
                    },
                    transaction: {
                      $ref: '#/components/schemas/TransactionResponse'
                    }
                  }
                }
              }
            }
          },
          400: { $ref: '#/components/responses/ValidationError' },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      },
      delete: {
        tags: ['Transactions'],
        summary: 'Soft delete de transação',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Transação deletada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Transaction deleted successfully'
                    },
                    transaction: {
                      $ref: '#/components/schemas/TransactionResponse'
                    }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions/{id}/hard': {
      delete: {
        tags: ['Transactions'],
        summary: 'Hard delete de transação (remoção permanente)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Transação removida permanentemente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Transaction permanently deleted successfully'
                    },
                    transaction: {
                      $ref: '#/components/schemas/TransactionResponse'
                    }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions/{id}/restore': {
      patch: {
        tags: ['Transactions'],
        summary: 'Restaurar transação deletada',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
        responses: {
          200: {
            description: 'Transação restaurada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Transaction restored successfully'
                    },
                    transaction: {
                      $ref: '#/components/schemas/TransactionResponse'
                    }
                  }
                }
              }
            }
          },
          401: { $ref: '#/components/responses/UnauthorizedError' },
          403: { $ref: '#/components/responses/ForbiddenError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    }
  },
  components: {
    schemas: {
      UserResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000'
          },
          firstName: { type: 'string', example: 'Sarah' },
          lastName: { type: 'string', example: 'Connor' },
          email: {
            type: 'string',
            format: 'email',
            example: 'sarah@resistance.com'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user'
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-06-20T18:49:08.459Z'
          }
        }
      },
      DeletedUserResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            example: 'user'
          },
          deletedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateUserInput: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password'],
        properties: {
          firstName: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            example: 'Sarah'
          },
          lastName: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            example: 'Connor'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'sarah@resistance.com'
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 32,
            example: 'Str0ng!Pass'
          }
        }
      },
      UpdateUserInput: {
        type: 'object',
        properties: {
          firstName: { type: 'string', minLength: 2, maxLength: 50 },
          lastName: { type: 'string', minLength: 2, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 32,
            description:
              'Must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'
          }
        }
      },
      BalanceResponse: {
        type: 'object',
        properties: {
          userId: { type: 'string', format: 'uuid' },
          userName: { type: 'string', example: 'Sarah Connor' },
          userEmail: {
            type: 'string',
            format: 'email',
            example: 'sarah@resistance.com'
          },
          balance: {
            type: 'object',
            properties: {
              totalIncome: { type: 'number', example: 10000.0 },
              totalExpense: { type: 'number', example: 3000.0 },
              totalInvestment: { type: 'number', example: 2000.0 },
              balance: { type: 'number', example: 5000.0 }
            }
          }
        }
      },
      TransactionResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Freelance Payment' },
          amount: { type: 'number', example: 2500.0 },
          type: { type: 'string', enum: ['income', 'expense', 'investment'] },
          description: { type: 'string', nullable: true },
          transactionDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true }
        }
      },
      DeletedTransactionResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          amount: { type: 'number' },
          type: { type: 'string', enum: ['income', 'expense', 'investment'] },
          deletedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateTransactionInput: {
        type: 'object',
        required: ['name', 'amount', 'type'],
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            example: 'Freelance Payment'
          },
          amount: { type: 'number', exclusiveMinimum: 0, example: 2500.0 },
          description: { type: 'string', maxLength: 500, nullable: true },
          type: { type: 'string', enum: ['income', 'expense', 'investment'] },
          transactionDate: { type: 'string', format: 'date-time' }
        }
      },
      UpdateTransactionInput: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          amount: { type: 'number', exclusiveMinimum: 0 },
          description: { type: 'string', maxLength: 500, nullable: true },
          type: { type: 'string', enum: ['income', 'expense', 'investment'] },
          transactionDate: { type: 'string', format: 'date-time' }
        }
      },
      ValidationErrorDetail: {
        type: 'object',
        properties: {
          field: { type: 'string', example: 'email' },
          message: { type: 'string', example: 'Invalid email format' }
        }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'admin@localhost.com'
          },
          password: {
            type: 'string',
            example: 'Admin@123'
          }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIs...'
          },
          refreshToken: {
            type: 'string',
            example: 'a1b2c3d4e5f6...'
          },
          user: { $ref: '#/components/schemas/UserResponse' }
        }
      },
      RefreshTokenInput: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            example: 'a1b2c3d4e5f6...'
          }
        }
      },
      RefreshTokenResponse: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIs...'
          },
          refreshToken: {
            type: 'string',
            example: 'f6e5d4c3b2a1...'
          }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    responses: {
      ValidationError: {
        description: 'Erro de validação',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Validation failed' },
                details: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ValidationErrorDetail' }
                }
              }
            }
          }
        }
      },
      NotFoundError: {
        description: 'Recurso não encontrado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'User not found' }
              }
            }
          }
        }
      },
      ConflictError: {
        description: 'Conflito (ex: email já existe)',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Email already exists' }
              }
            }
          }
        }
      },
      UnauthorizedError: {
        description: 'Não autorizado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Token invalid or expired'
                }
              }
            }
          }
        }
      },
      ForbiddenError: {
        description: 'Acesso negado',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Cannot delete this user' }
              }
            }
          }
        }
      },
      TooManyRequests: {
        description: 'Muitas requisições',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'string',
                  example: 'Too many requests, please try again later'
                }
              }
            }
          }
        }
      }
    }
  }
}
