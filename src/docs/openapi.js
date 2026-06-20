export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Finance App API',
    version: '1.0.0',
    description: 'API para gerenciamento de usuários e transações financeiras'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desenvolvimento'
    }
  ],
  tags: [
    { name: 'Users', description: 'Gerenciamento de usuários' },
    { name: 'Transactions', description: 'Gerenciamento de transações' }
  ],
  paths: {
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'Listar todos os usuários',
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
          }
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
          409: { $ref: '#/components/responses/ConflictError' }
        }
      }
    },
    '/api/users/deleted': {
      get: {
        tags: ['Users'],
        summary: 'Listar usuários deletados (soft delete)',
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
          }
        }
      }
    },
    '/api/users/email/{email}': {
      get: {
        tags: ['Users'],
        summary: 'Buscar usuário por email',
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Buscar usuário por ID',
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      },
      patch: {
        tags: ['Users'],
        summary: 'Atualizar usuário',
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
          404: { $ref: '#/components/responses/NotFoundError' },
          409: { $ref: '#/components/responses/ConflictError' }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Soft delete de usuário',
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
          404: { $ref: '#/components/responses/NotFoundError' },
          403: { $ref: '#/components/responses/ForbiddenError' }
        }
      }
    },
    '/api/users/{id}/hard': {
      delete: {
        tags: ['Users'],
        summary: 'Hard delete de usuário (remoção permanente)',
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
          404: { $ref: '#/components/responses/NotFoundError' },
          403: { $ref: '#/components/responses/ForbiddenError' }
        }
      }
    },
    '/api/users/{id}/restore': {
      patch: {
        tags: ['Users'],
        summary: 'Restaurar usuário deletado',
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/users/{id}/balance': {
      get: {
        tags: ['Users'],
        summary: 'Obter saldo do usuário',
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions': {
      get: {
        tags: ['Transactions'],
        summary: 'Listar transações de um usuário',
        parameters: [
          {
            name: 'userId',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'uuid' }
          }
        ],
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      },
      post: {
        tags: ['Transactions'],
        summary: 'Criar uma nova transação',
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions/deleted': {
      get: {
        tags: ['Transactions'],
        summary: 'Listar todas as transações deletadas',
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
          }
        }
      }
    },
    '/api/transactions/deleted/{userId}': {
      get: {
        tags: ['Transactions'],
        summary: 'Listar transações deletadas de um usuário específico',
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions/{id}': {
      patch: {
        tags: ['Transactions'],
        summary: 'Atualizar transação',
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
                schema: { $ref: '#/components/schemas/TransactionResponse' }
              }
            }
          },
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      },
      delete: {
        tags: ['Transactions'],
        summary: 'Soft delete de transação',
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions/{id}/hard': {
      delete: {
        tags: ['Transactions'],
        summary: 'Hard delete de transação (remoção permanente)',
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
          404: { $ref: '#/components/responses/NotFoundError' }
        }
      }
    },
    '/api/transactions/{id}/restore': {
      patch: {
        tags: ['Transactions'],
        summary: 'Restaurar transação deletada',
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
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true }
        }
      },
      DeletedUserResponse: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
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
          password: { type: 'string', minLength: 8, maxLength: 32 }
        }
      },
      BalanceResponse: {
        type: 'object',
        properties: {
          balance: { type: 'number', example: 1500.5 },
          currency: { type: 'string', example: 'BRL' }
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
        required: ['userId', 'name', 'amount', 'type'],
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000'
          },
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
      }
    }
  }
}
