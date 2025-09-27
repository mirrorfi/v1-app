/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/mirrorfi_vault.json`.
 */
export type MirrorfiVault = {
  "address": "MFiKi9h7NgFHXcuBSunkTDZL7ssNynUtVC1JhtKgkk8",
  "metadata": {
    "name": "mirrorfiVault",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "mappingInitialize",
      "discriminator": [
        135,
        75,
        142,
        17,
        13,
        75,
        11,
        33
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol"
        },
        {
          "name": "mapping",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  112,
                  112,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "oracleTypes",
          "type": {
            "vec": {
              "defined": {
                "name": "oracleType"
              }
            }
          }
        }
      ]
    },
    {
      "name": "mappingRefresh",
      "discriminator": [
        75,
        1,
        169,
        229,
        164,
        62,
        180,
        144
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mapping",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  112,
                  112,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint"
        }
      ],
      "args": []
    },
    {
      "name": "mappingUpdate",
      "discriminator": [
        241,
        99,
        68,
        33,
        87,
        169,
        97,
        115
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol"
        },
        {
          "name": "mapping",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  112,
                  112,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "oracleTypes",
          "type": {
            "vec": {
              "defined": {
                "name": "oracleType"
              }
            }
          }
        }
      ]
    },
    {
      "name": "oracleInitialize",
      "docs": [
        "This function initializes an oracle for token price data"
      ],
      "discriminator": [
        241,
        174,
        191,
        53,
        177,
        138,
        178,
        186
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "protocol"
          ]
        },
        {
          "name": "protocol",
          "docs": [
            "The protocol account this oracle belongs to"
          ]
        },
        {
          "name": "oracle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "protocol"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "tokenMint",
          "docs": [
            "Mint address of the token this oracle is for"
          ]
        },
        {
          "name": "pythOracle"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "oracleInitializeArgs"
            }
          }
        }
      ]
    },
    {
      "name": "protocolInitialize",
      "discriminator": [
        157,
        216,
        145,
        163,
        56,
        220,
        217,
        143
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "protocolInitializeArgs"
            }
          }
        }
      ]
    },
    {
      "name": "protocolTreasuryWithdraw",
      "discriminator": [
        27,
        28,
        4,
        24,
        69,
        67,
        35,
        176
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol"
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "adminAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "admin"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "treasuryAta",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "protocolUpdate",
      "discriminator": [
        21,
        85,
        179,
        150,
        236,
        167,
        203,
        80
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "protocol",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "protocolUpdateArgs"
            }
          }
        }
      ]
    },
    {
      "name": "solUnwrap",
      "discriminator": [
        221,
        180,
        139,
        111,
        155,
        218,
        71,
        86
      ],
      "accounts": [
        {
          "name": "wsolBuffer",
          "docs": [
            "CHECK Safe only for buffer authority"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  115,
                  111,
                  108,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "wsolAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wsolBuffer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenMint",
          "address": "So11111111111111111111111111111111111111112"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "solWrap",
      "discriminator": [
        195,
        184,
        27,
        186,
        126,
        210,
        93,
        69
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenMint",
          "address": "So11111111111111111111111111111111111111112"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "vaultCollectFee",
      "discriminator": [
        36,
        31,
        156,
        39,
        112,
        176,
        107,
        163
      ],
      "accounts": [
        {
          "name": "manager",
          "writable": true,
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "protocol",
          "docs": [
            "The protocol account this vault belongs to"
          ],
          "relations": [
            "vault"
          ]
        },
        {
          "name": "treasury",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "vault"
        },
        {
          "name": "vaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vaultAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAuthority"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "treasuryAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "treasury"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "managerAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositTokenMint",
          "docs": [
            "The deposit token mint"
          ],
          "relations": [
            "vault"
          ]
        },
        {
          "name": "depositTokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "vaultDeposit",
      "discriminator": [
        231,
        150,
        41,
        113,
        180,
        104,
        162,
        120
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "treasury",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultDepositor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "mapping",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  112,
                  112,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ]
          }
        },
        {
          "name": "treasuryAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "treasury"
              },
              {
                "kind": "account",
                "path": "depositTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAuthority"
              },
              {
                "kind": "account",
                "path": "depositTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "depositTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositorShareAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultDepositor"
              },
              {
                "kind": "account",
                "path": "shareTokenProgram"
              },
              {
                "kind": "account",
                "path": "shareTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositTokenMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "shareTokenMint",
          "writable": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "depositTokenProgram"
        },
        {
          "name": "shareTokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultDepositArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultFreeze",
      "discriminator": [
        80,
        82,
        135,
        152,
        85,
        135,
        109,
        141
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "protocol"
          ]
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "vaultInitialize",
      "discriminator": [
        164,
        192,
        189,
        148,
        250,
        255,
        120,
        250
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "docs": [
            "The protocol account this vault belongs to"
          ]
        },
        {
          "name": "treasury",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "spotManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  112,
                  111,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAuthority"
              },
              {
                "kind": "account",
                "path": "depositTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositTokenMint",
          "docs": [
            "Mint address of the deposit token"
          ]
        },
        {
          "name": "shareTokenMint",
          "docs": [
            "Mint address of the share token (LP token)"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  115,
                  104,
                  97,
                  114,
                  101,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "depositTokenProgram"
        },
        {
          "name": "shareTokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultInitializeArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultKaminoActivate",
      "discriminator": [
        117,
        44,
        194,
        52,
        69,
        73,
        243,
        104
      ],
      "accounts": [
        {
          "name": "manager",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "vaultKaminoAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "kaminoManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "userMetadata",
          "writable": true
        },
        {
          "name": "referrerUserMetadata"
        },
        {
          "name": "kaminoProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultKaminoActivateArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultKaminoBorrow",
      "discriminator": [
        160,
        250,
        211,
        121,
        124,
        10,
        84,
        89
      ],
      "accounts": [
        {
          "name": "manager",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "spotManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  112,
                  111,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultKaminoAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "obligation",
          "writable": true
        },
        {
          "name": "lendingMarket"
        },
        {
          "name": "lendingMarketAuthority"
        },
        {
          "name": "borrowReserve",
          "writable": true
        },
        {
          "name": "borrowReserveSourceLiquidity",
          "writable": true
        },
        {
          "name": "borrowReserveLiquidityFeeReceiver",
          "writable": true
        },
        {
          "name": "referrerTokenState",
          "writable": true
        },
        {
          "name": "obligationFarmUserState",
          "writable": true
        },
        {
          "name": "reserveFarmState",
          "writable": true
        },
        {
          "name": "vaultKaminoAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultKaminoAuthority"
              },
              {
                "kind": "account",
                "path": "borrowTokenProgram"
              },
              {
                "kind": "account",
                "path": "borrowTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "borrowTokenMint"
        },
        {
          "name": "borrowTokenProgram"
        },
        {
          "name": "instructionSysvarAccount"
        },
        {
          "name": "kaminoProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "farmsProgram",
          "address": "FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultKaminoBorrowArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultKaminoCloseAta",
      "discriminator": [
        199,
        84,
        13,
        196,
        254,
        226,
        124,
        119
      ],
      "accounts": [
        {
          "name": "manager",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "docs": [
            "The vault for the operation"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "vaultKaminoAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultKaminoAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultKaminoAuthority"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultKaminoCloseAtaArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultKaminoDeposit",
      "discriminator": [
        175,
        188,
        91,
        241,
        124,
        3,
        218,
        132
      ],
      "accounts": [
        {
          "name": "manager",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultKaminoAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "obligation",
          "writable": true
        },
        {
          "name": "lendingMarket"
        },
        {
          "name": "lendingMarketAuthority"
        },
        {
          "name": "reserve",
          "writable": true
        },
        {
          "name": "reserveLiquiditySupply",
          "writable": true
        },
        {
          "name": "reserveDestinationDepositCollateral",
          "writable": true
        },
        {
          "name": "reserveFarmState",
          "writable": true
        },
        {
          "name": "obligationFarmState",
          "writable": true
        },
        {
          "name": "vaultAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAuthority"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "liquidityTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultKaminoAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultKaminoAuthority"
              },
              {
                "kind": "account",
                "path": "liquidityTokenProgram"
              },
              {
                "kind": "account",
                "path": "liquidityTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "liquidityTokenMint"
        },
        {
          "name": "collateralTokenMint",
          "writable": true
        },
        {
          "name": "liquidityTokenProgram"
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "instructionSysvarAccount"
        },
        {
          "name": "kaminoProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "farmsProgram",
          "address": "FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultKaminoDepositArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultKaminoInitObligation",
      "discriminator": [
        64,
        116,
        108,
        217,
        96,
        115,
        216,
        254
      ],
      "accounts": [
        {
          "name": "manager",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "vaultKaminoAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "kaminoManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "obligation",
          "writable": true
        },
        {
          "name": "lendingMarket"
        },
        {
          "name": "seed1Account"
        },
        {
          "name": "seed2Account"
        },
        {
          "name": "ownerUserMetadata"
        },
        {
          "name": "kaminoProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultKaminoInitObligationArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultKaminoRepay",
      "discriminator": [
        228,
        101,
        234,
        250,
        164,
        9,
        195,
        184
      ],
      "accounts": [
        {
          "name": "manager",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "vaultKaminoAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "obligation",
          "writable": true
        },
        {
          "name": "lendingMarket"
        },
        {
          "name": "lendingMarketAuthority"
        },
        {
          "name": "repayReserve",
          "writable": true
        },
        {
          "name": "repayReserveDestinationLiquidity",
          "writable": true
        },
        {
          "name": "obligationFarmUserState",
          "writable": true
        },
        {
          "name": "reserveFarmState",
          "writable": true
        },
        {
          "name": "vaultKaminoAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultKaminoAuthority"
              },
              {
                "kind": "account",
                "path": "repayTokenProgram"
              },
              {
                "kind": "account",
                "path": "repayTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "repayTokenMint"
        },
        {
          "name": "repayTokenProgram"
        },
        {
          "name": "instructionSysvarAccount"
        },
        {
          "name": "kaminoProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "farmsProgram",
          "address": "FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultKaminoRepayArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultKaminoWithdraw",
      "discriminator": [
        43,
        191,
        13,
        47,
        205,
        141,
        33,
        216
      ],
      "accounts": [
        {
          "name": "manager",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "manager"
              },
              {
                "kind": "arg",
                "path": "args.id"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultKaminoAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "obligation",
          "writable": true
        },
        {
          "name": "lendingMarket"
        },
        {
          "name": "lendingMarketAuthority"
        },
        {
          "name": "reserve",
          "writable": true
        },
        {
          "name": "reserveLiquiditySupply",
          "writable": true
        },
        {
          "name": "reserveSourceCollateral",
          "writable": true
        },
        {
          "name": "reserveFarmState",
          "writable": true
        },
        {
          "name": "obligationFarmState",
          "writable": true
        },
        {
          "name": "vaultAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAuthority"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "liquidityTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultKaminoAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultKaminoAuthority"
              },
              {
                "kind": "account",
                "path": "liquidityTokenProgram"
              },
              {
                "kind": "account",
                "path": "liquidityTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "liquidityTokenMint"
        },
        {
          "name": "collateralTokenMint",
          "writable": true
        },
        {
          "name": "liquidityTokenProgram"
        },
        {
          "name": "collateralTokenProgram"
        },
        {
          "name": "instructionSysvarAccount"
        },
        {
          "name": "kaminoProgram",
          "address": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
        },
        {
          "name": "farmsProgram",
          "address": "FarmsPZpWu9i7Kky8tPN37rs2TpmMrAZrC7S7vJa91Hr"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultKaminoWithdrawArgs"
            }
          }
        }
      ]
    },
    {
      "name": "vaultRefreshNav",
      "discriminator": [
        38,
        42,
        143,
        167,
        242,
        93,
        197,
        142
      ],
      "accounts": [
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "spotManager",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  112,
                  111,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "vaultRefreshNavKamino",
      "discriminator": [
        68,
        119,
        202,
        93,
        236,
        86,
        147,
        80
      ],
      "accounts": [
        {
          "name": "vault"
        },
        {
          "name": "kaminoManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  107,
                  97,
                  109,
                  105,
                  110,
                  111,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "obligation1",
          "optional": true
        },
        {
          "name": "obligation2",
          "optional": true
        },
        {
          "name": "obligation3",
          "optional": true
        },
        {
          "name": "obligation4",
          "optional": true
        },
        {
          "name": "obligation5",
          "optional": true
        }
      ],
      "args": []
    },
    {
      "name": "vaultUnfreeze",
      "discriminator": [
        223,
        117,
        126,
        203,
        137,
        63,
        202,
        43
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true,
          "relations": [
            "protocol"
          ]
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "vaultWithdraw",
      "discriminator": [
        98,
        28,
        187,
        98,
        87,
        69,
        46,
        64
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "protocol",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "treasury",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultDepositor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "vaultAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "mapping",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  112,
                  112,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ]
          }
        },
        {
          "name": "vaultAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultAuthority"
              },
              {
                "kind": "account",
                "path": "depositTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "treasuryAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "treasury"
              },
              {
                "kind": "account",
                "path": "depositTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "account",
                "path": "depositTokenProgram"
              },
              {
                "kind": "account",
                "path": "depositTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositorShareAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultDepositor"
              },
              {
                "kind": "account",
                "path": "shareTokenProgram"
              },
              {
                "kind": "account",
                "path": "shareTokenMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "depositTokenMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "shareTokenMint",
          "writable": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "depositTokenProgram"
        },
        {
          "name": "shareTokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "vaultWithdrawArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "kaminoManager",
      "discriminator": [
        24,
        238,
        24,
        179,
        130,
        104,
        5,
        243
      ]
    },
    {
      "name": "mapping",
      "discriminator": [
        18,
        206,
        25,
        210,
        237,
        88,
        255,
        93
      ]
    },
    {
      "name": "oracle",
      "discriminator": [
        139,
        194,
        131,
        179,
        140,
        179,
        229,
        244
      ]
    },
    {
      "name": "protocol",
      "discriminator": [
        45,
        39,
        101,
        43,
        115,
        72,
        131,
        40
      ]
    },
    {
      "name": "spotManager",
      "discriminator": [
        233,
        221,
        216,
        171,
        217,
        147,
        3,
        63
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    },
    {
      "name": "vaultDepositor",
      "discriminator": [
        87,
        109,
        182,
        106,
        87,
        96,
        63,
        211
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6001,
      "name": "unauthorizedAccess",
      "msg": "Unauthorized access"
    },
    {
      "code": 6002,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6003,
      "name": "mathOverflow",
      "msg": "Math overflow"
    },
    {
      "code": 6004,
      "name": "zeroDivision",
      "msg": "Zero Division Error"
    },
    {
      "code": 6005,
      "name": "unknownError",
      "msg": "Unknown Error"
    },
    {
      "code": 6006,
      "name": "invalidProgramId",
      "msg": "Invalid Program ID"
    },
    {
      "code": 6007,
      "name": "invalidAccountDiscriminator",
      "msg": "Invalid Account Discriminator"
    },
    {
      "code": 6008,
      "name": "invalidAccountOwner",
      "msg": "Invalid Account Owner"
    },
    {
      "code": 6009,
      "name": "invalidAccountLength",
      "msg": "Invalid Account Length"
    },
    {
      "code": 6010,
      "name": "invalidOracleTypeLength",
      "msg": "Oracle type length must be greater than 0"
    },
    {
      "code": 6011,
      "name": "oracleStale",
      "msg": "Oracle stale"
    },
    {
      "code": 6012,
      "name": "oracleConfDeviated",
      "msg": "Oracle confidence exceeded max allowed deviation from price"
    },
    {
      "code": 6013,
      "name": "invalidPrice",
      "msg": "Price is not finite"
    },
    {
      "code": 6014,
      "name": "noValidPrice",
      "msg": "No valid price found"
    },
    {
      "code": 6015,
      "name": "invalidPythAccount",
      "msg": "Account passed is not owned by Pyth program"
    },
    {
      "code": 6016,
      "name": "invalidAddress",
      "msg": "Address cannot be default public key"
    },
    {
      "code": 6017,
      "name": "accountInvalid",
      "msg": "Account Invalid"
    },
    {
      "code": 6018,
      "name": "accountNotInitialized",
      "msg": "Account not initialized"
    },
    {
      "code": 6019,
      "name": "accountVersionUnallowed",
      "msg": "Account version unallowed"
    },
    {
      "code": 6020,
      "name": "insufficientRemainingAccounts",
      "msg": "Insufficient remaining accounts"
    },
    {
      "code": 6021,
      "name": "protocolNotSupported",
      "msg": "Activity on the protocol is not supported"
    },
    {
      "code": 6022,
      "name": "protocolNotActivated",
      "msg": "Vault activity on the protocol not activated"
    },
    {
      "code": 6023,
      "name": "spotPositionSlotAlreadyActive",
      "msg": "Spot position slot already active"
    },
    {
      "code": 6024,
      "name": "spotPositionSlotNotActive",
      "msg": "Spot position slot not active"
    },
    {
      "code": 6025,
      "name": "invalidSpotPositionSlot",
      "msg": "Invalid spot position slot"
    },
    {
      "code": 6026,
      "name": "spotPositionNotFound",
      "msg": "Spot position not found"
    },
    {
      "code": 6027,
      "name": "maxSpotPositionReached",
      "msg": "Max spot position reached"
    },
    {
      "code": 6028,
      "name": "spotPositionMismatch",
      "msg": "Spot position mismatch"
    },
    {
      "code": 6029,
      "name": "spotPositionNotEmpty",
      "msg": "Spot position not empty"
    },
    {
      "code": 6030,
      "name": "obligationSlotAlreadyActive",
      "msg": "obligation slot already active"
    },
    {
      "code": 6031,
      "name": "obligationSlotNotActive",
      "msg": "obligation slot not active"
    },
    {
      "code": 6032,
      "name": "invalidObligationSlot",
      "msg": "invalid obligation slot"
    },
    {
      "code": 6033,
      "name": "obligationNotFound",
      "msg": "obligation not found"
    },
    {
      "code": 6034,
      "name": "maxObligationReached",
      "msg": "max obligation reached"
    },
    {
      "code": 6035,
      "name": "obligationMismatch",
      "msg": "obligation mismatch"
    },
    {
      "code": 6036,
      "name": "zeroAmountNotAllowed",
      "msg": "zero amount not allowed"
    },
    {
      "code": 6037,
      "name": "insufficientLiquidity",
      "msg": "vault liquidity insufficient for withdrawal"
    },
    {
      "code": 6038,
      "name": "insufficientSolToWrap",
      "msg": "Insufficient SOL to wrap"
    },
    {
      "code": 6039,
      "name": "insufficientWSolToUnwrap",
      "msg": "Insufficient WSOL to unwrap"
    },
    {
      "code": 6040,
      "name": "protocolFrozen",
      "msg": "Protocol is frozen"
    },
    {
      "code": 6041,
      "name": "invalidTreasury",
      "msg": "Treasury account provided is invalid"
    },
    {
      "code": 6042,
      "name": "mFerFrozen",
      "msg": "MirrorFi User is frozen"
    },
    {
      "code": 6043,
      "name": "vaultFrozen",
      "msg": "Vault is frozen"
    },
    {
      "code": 6044,
      "name": "navNotRefreshed",
      "msg": "Vault NAV has not been refreshed"
    },
    {
      "code": 6045,
      "name": "kaminoNotRefreshed",
      "msg": "Kamino has not been refreshed"
    },
    {
      "code": 6046,
      "name": "obligationNotRefreshed",
      "msg": "Obligation has not been refreshed"
    },
    {
      "code": 6047,
      "name": "insufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6048,
      "name": "insufficientShares",
      "msg": "Insufficient shares for withdrawal"
    },
    {
      "code": 6049,
      "name": "invalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6050,
      "name": "invalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6051,
      "name": "invalidDestinationAccount",
      "msg": "Invalid destination account"
    },
    {
      "code": 6052,
      "name": "operationNotAllowed",
      "msg": "Operation not allowed"
    },
    {
      "code": 6053,
      "name": "zeroWithdrawalUnallowed",
      "msg": "Zero Withdrawal is not allowed"
    },
    {
      "code": 6054,
      "name": "zeroDepositUnallowed",
      "msg": "Zero Deposit is not allowed"
    },
    {
      "code": 6055,
      "name": "depositTooSmall",
      "msg": "Deposit amount is too small"
    },
    {
      "code": 6056,
      "name": "depositTooLarge",
      "msg": "Deposit amount is too large"
    },
    {
      "code": 6057,
      "name": "withdrawalTooSmall",
      "msg": "Withdrawal amount is too small"
    },
    {
      "code": 6058,
      "name": "withdrawalTooLarge",
      "msg": "Withdrawal amount is too large"
    },
    {
      "code": 6059,
      "name": "invalidMappingMint",
      "msg": "Mint provided does not match the mapping mint"
    },
    {
      "code": 6060,
      "name": "mappingStale",
      "msg": "Mapping needs to be refreshed"
    },
    {
      "code": 6061,
      "name": "invalidMappingAccount",
      "msg": "Mapping account cannot be deserialized"
    },
    {
      "code": 6062,
      "name": "noMatchingMintInPosition",
      "msg": "Mapping mint not found in spot position"
    }
  ],
  "types": [
    {
      "name": "bitmask",
      "type": {
        "kind": "struct",
        "fields": [
          "u8"
        ]
      }
    },
    {
      "name": "kaminoManager",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "align0",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "activeObligations",
            "type": "u8"
          },
          {
            "name": "maxObligations",
            "type": "u8"
          },
          {
            "name": "lastNav",
            "type": "u64"
          },
          {
            "name": "refreshedAt",
            "type": "i64"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "kaminoManagerAuthority",
            "type": "pubkey"
          },
          {
            "name": "obligations",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "kaminoManagerObligation"
                  }
                },
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "kaminoManagerObligation",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "slot",
            "type": "u8"
          },
          {
            "name": "align0",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "lastNav",
            "type": "u64"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u64",
                19
              ]
            }
          },
          {
            "name": "obligation",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "seed1",
            "type": "pubkey"
          },
          {
            "name": "seed2",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "mapping",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "lastRefreshedSlot",
            "type": "u64"
          },
          {
            "name": "price",
            "docs": [
              "Price is only stored in f64 and never calculated directly due to lack of floating Rust type support"
            ],
            "type": "f64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "oracleTypes",
            "type": {
              "vec": {
                "defined": {
                  "name": "oracleType"
                }
              }
            }
          },
          {
            "name": "decimals",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "oracle",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "protocol",
            "docs": [
              "Protocol this oracle belongs to"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenMint",
            "docs": [
              "Token mint that this oracle provides price data for"
            ],
            "type": "pubkey"
          },
          {
            "name": "tokenProgram",
            "type": "pubkey"
          },
          {
            "name": "id",
            "docs": [
              "Unique identifier for this oracle"
            ],
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "pythOracle",
            "type": "pubkey"
          },
          {
            "name": "pythPriceFeed",
            "type": {
              "array": [
                "u8",
                45
              ]
            }
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "align0",
            "type": {
              "array": [
                "u8",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "oracleInitializeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "oracleType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pyth",
            "fields": [
              {
                "name": "priceUpdateV2",
                "type": "pubkey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "protocol",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stateFlags",
            "docs": [
              "Bitfield for various platform-level state."
            ],
            "type": {
              "defined": {
                "name": "bitmask"
              }
            }
          },
          {
            "name": "bump",
            "docs": [
              "Bump used for PDA derivation."
            ],
            "type": "u8"
          },
          {
            "name": "treasuryBump",
            "docs": [
              "Bump used for PDA derivation."
            ],
            "type": "u8"
          },
          {
            "name": "align0",
            "type": {
              "array": [
                "u8",
                5
              ]
            }
          },
          {
            "name": "platformFeeBps",
            "docs": [
              "Fee taken from vault profits, in basis points."
            ],
            "type": "u16"
          },
          {
            "name": "platformCommissionFeeBps",
            "type": "u16"
          },
          {
            "name": "platformDepositFeeBps",
            "type": "u16"
          },
          {
            "name": "platformWithdrawalFeeBps",
            "type": "u16"
          },
          {
            "name": "admin",
            "docs": [
              "Authority of protocol."
            ],
            "type": "pubkey"
          },
          {
            "name": "protocolsIntegrated",
            "docs": [
              "Number of protocols integrated, supports up to 255."
            ],
            "type": "u8"
          },
          {
            "name": "align1",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "activeIntegrations",
            "docs": [
              "Bitfield for protocol integrations that are active.",
              "Each bit represents a protocol integration, where 1 is active and 0 is inactive."
            ],
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "protocolInitializeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "platformCommissionFeeBps",
            "type": "u16"
          },
          {
            "name": "platformDepositFeeBps",
            "type": "u16"
          },
          {
            "name": "platformWithdrawalFeeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "protocolUpdateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "platformFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "platformCommissionFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "platformDepositFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "platformWithdrawalFeeBps",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "admin",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "isFrozen",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "enableKamino",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "enableMeteora",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "enableOrca",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "enableDrift",
            "type": {
              "option": "bool"
            }
          }
        ]
      }
    },
    {
      "name": "spotManager",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "align0",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "activePositions",
            "type": "u8"
          },
          {
            "name": "maxPositions",
            "type": "u8"
          },
          {
            "name": "lastNav",
            "type": "u64"
          },
          {
            "name": "refreshedAt",
            "type": "i64"
          },
          {
            "name": "padding0",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "vaultAuthority",
            "type": "pubkey"
          },
          {
            "name": "positions",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "spotPosition"
                  }
                },
                24
              ]
            }
          }
        ]
      }
    },
    {
      "name": "spotPosition",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "slot",
            "type": "u8"
          },
          {
            "name": "align0",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "tokenMint",
            "type": "pubkey"
          },
          {
            "name": "lastNav",
            "type": "u64"
          },
          {
            "name": "lastNavUpdatedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vault",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "isClosed",
            "type": "bool"
          },
          {
            "name": "isFrozen",
            "type": "bool"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "isKamino",
            "docs": [
              "Protocol Integrations"
            ],
            "type": "bool"
          },
          {
            "name": "isMeteora",
            "type": "bool"
          },
          {
            "name": "reservedProtocols",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "depositTokenDecimals",
            "type": "u8"
          },
          {
            "name": "lookupTable",
            "docs": [
              "Vault Look Up Table"
            ],
            "type": "pubkey"
          },
          {
            "name": "pubkey",
            "docs": [
              "Unique Address of the vault"
            ],
            "type": "pubkey"
          },
          {
            "name": "manager",
            "docs": [
              "Manager of the Vault"
            ],
            "type": "pubkey"
          },
          {
            "name": "protocol",
            "docs": [
              "Protocol associated with this vault"
            ],
            "type": "pubkey"
          },
          {
            "name": "vaultAuthority",
            "docs": [
              "Vault authority (PDA)"
            ],
            "type": "pubkey"
          },
          {
            "name": "depositTokenMint",
            "docs": [
              "Mint address of the Vault's accepted deposit token"
            ],
            "type": "pubkey"
          },
          {
            "name": "shareTokenMint",
            "docs": [
              "Mint address of the Vault Share Position tokens"
            ],
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "docs": [
              "Timestamp when the vault was created"
            ],
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "docs": [
              "Timestamp of the last update"
            ],
            "type": "i64"
          },
          {
            "name": "lastGavUpdateAt",
            "docs": [
              "Timestamp of last NAV update"
            ],
            "type": "i64"
          },
          {
            "name": "lastResolveAt",
            "docs": [
              "Timestamp of last Resolve"
            ],
            "type": "i64"
          },
          {
            "name": "managerFeeRate",
            "docs": [
              "Manager fee rate, 1000 = 1% (decimal = 3)"
            ],
            "type": "u64"
          },
          {
            "name": "lastGavUsd",
            "docs": [
              "Last calculated Gross Asset Value (in USD & Deposit Token)"
            ],
            "type": "u64"
          },
          {
            "name": "lastGavToken",
            "type": "u64"
          },
          {
            "name": "lastTotalProfitUsd",
            "type": "u64"
          },
          {
            "name": "lastTotalProfitToken",
            "type": "u64"
          },
          {
            "name": "totalDeposit",
            "docs": [
              "Total amount deposited into the vault"
            ],
            "type": "u64"
          },
          {
            "name": "totalWithdrawal",
            "docs": [
              "Total amount withdrawn from the vault"
            ],
            "type": "u64"
          },
          {
            "name": "totalClaimedFee",
            "type": "u64"
          },
          {
            "name": "totalClaimedProtocolFee",
            "type": "u64"
          },
          {
            "name": "freshCapital",
            "docs": [
              "(NOT USED YET) Vault Capital Tracking"
            ],
            "type": "u64"
          },
          {
            "name": "requestCapital",
            "type": "u64"
          },
          {
            "name": "withdrawableCapital",
            "type": "u64"
          },
          {
            "name": "delegatee1",
            "docs": [
              "(NOT USED YET) Authorized account to manage the vault"
            ],
            "type": "pubkey"
          },
          {
            "name": "delegatee1Stop",
            "type": "i64"
          },
          {
            "name": "delegatee2",
            "type": "pubkey"
          },
          {
            "name": "delegatee2Stop",
            "type": "i64"
          },
          {
            "name": "padding",
            "docs": [
              "Padding for future use"
            ],
            "type": {
              "array": [
                "u64",
                61
              ]
            }
          }
        ]
      }
    },
    {
      "name": "vaultDepositArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vaultDepositor",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "align",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "totalShares",
            "docs": [
              "Total shares currently held"
            ],
            "type": "u64"
          },
          {
            "name": "totalCost",
            "docs": [
              "Total cost basis for current shares (in token units)"
            ],
            "type": "u64"
          },
          {
            "name": "realizedPnl",
            "docs": [
              "Realized profit/loss from past sells (in token units)"
            ],
            "type": "i64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u64",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "vaultInitializeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "lookupTable",
            "type": "pubkey"
          },
          {
            "name": "managerFeeRate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vaultKaminoActivateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "initMetadata",
            "type": "bool"
          },
          {
            "name": "userLookupTable",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "vaultKaminoBorrowArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "borrowAmount",
            "type": "u64"
          },
          {
            "name": "hasReferrer",
            "type": "bool"
          },
          {
            "name": "hasFarm",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "vaultKaminoCloseAtaArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vaultKaminoDepositArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "initFarm",
            "type": "bool"
          },
          {
            "name": "depositAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vaultKaminoInitObligationArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "obligationId",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "vaultKaminoRepayArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "repayAmount",
            "type": "u64"
          },
          {
            "name": "hasFarm",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "vaultKaminoWithdrawArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "hasFarm",
            "type": "bool"
          },
          {
            "name": "withdrawAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "vaultWithdrawArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "withdrawAll",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
