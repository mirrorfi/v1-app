/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/mirrorfi_vault.json`.
 */
export type MirrorfiVault = {
  "address": "MFerSc4KKyyXRmqGnNZ9dFGrGDG9aGRuZEE1Ftz7prS",
  "metadata": {
    "name": "mirrorfiVault",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "kaminoInitObligation",
      "docs": [
        "This function initializes a new obligation in the Kamino lending protocol"
      ],
      "discriminator": [
        253,
        177,
        160,
        225,
        70,
        156,
        217,
        109
      ],
      "accounts": [
        {
          "name": "obligationOwner",
          "docs": [
            "The signer of the obligation (user's wallet)"
          ],
          "signer": true
        },
        {
          "name": "feePayer",
          "docs": [
            "The account that will pay the transaction fee"
          ],
          "writable": true,
          "signer": true
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
          "docs": [
            "Required by Kamino's init_obligation function"
          ],
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "docs": [
            "Required by Kamino's init_obligation function"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "kaminoInitObligationArgs"
            }
          }
        }
      ]
    },
    {
      "name": "mferDeposit",
      "discriminator": [
        166,
        81,
        101,
        252,
        132,
        97,
        207,
        185
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "The user who is depositing tokens"
          ],
          "writable": true,
          "signer": true,
          "relations": [
            "mfer"
          ]
        },
        {
          "name": "mfer",
          "docs": [
            "The user account"
          ],
          "writable": true
        },
        {
          "name": "protocol",
          "docs": [
            "The protocol account"
          ],
          "relations": [
            "mfer"
          ]
        },
        {
          "name": "mferAuthority",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  117,
                  115,
                  101,
                  114,
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
                "path": "mfer"
              }
            ]
          }
        },
        {
          "name": "ownerAta",
          "docs": [
            "The owner's token account for this mint"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
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
          "name": "mferAuthorityAta",
          "docs": [
            "The token account for the user_authority PDA"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mferAuthority"
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
          "docs": [
            "The token mint to deposit"
          ]
        },
        {
          "name": "tokenProgram",
          "docs": [
            "The token program to use (supports token-2022)"
          ],
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
          "name": "args",
          "type": {
            "defined": {
              "name": "mFerDepositArgs"
            }
          }
        }
      ]
    },
    {
      "name": "mferFreeze",
      "discriminator": [
        43,
        88,
        104,
        164,
        194,
        4,
        235,
        207
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "The protocol admin that can freeze users"
          ],
          "signer": true,
          "relations": [
            "protocol"
          ]
        },
        {
          "name": "user"
        },
        {
          "name": "protocol",
          "docs": [
            "The protocol this user belongs to"
          ]
        },
        {
          "name": "mfer",
          "docs": [
            "The user account to freeze"
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
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "protocol"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "mferInitialize",
      "discriminator": [
        252,
        144,
        214,
        128,
        181,
        199,
        217,
        86
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "owner",
          "docs": [
            "The owner of this user account"
          ],
          "signer": true
        },
        {
          "name": "protocol",
          "docs": [
            "The protocol this user belongs to"
          ]
        },
        {
          "name": "mfer",
          "docs": [
            "The user account to initialize"
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
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "protocol"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "mferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  117,
                  115,
                  101,
                  114,
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
                "path": "mfer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "mferUnfreeze",
      "discriminator": [
        54,
        180,
        66,
        248,
        205,
        2,
        91,
        232
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "The protocol admin that can unfreeze users"
          ],
          "signer": true,
          "relations": [
            "protocol"
          ]
        },
        {
          "name": "user"
        },
        {
          "name": "protocol",
          "docs": [
            "The protocol this user belongs to"
          ]
        },
        {
          "name": "mfer",
          "docs": [
            "The user account to unfreeze"
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
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "protocol"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "mferWithdraw",
      "discriminator": [
        165,
        39,
        23,
        175,
        48,
        84,
        239,
        148
      ],
      "accounts": [
        {
          "name": "owner",
          "docs": [
            "The user who is withdrawing tokens"
          ],
          "writable": true,
          "signer": true,
          "relations": [
            "mfer"
          ]
        },
        {
          "name": "mfer",
          "writable": true
        },
        {
          "name": "protocol",
          "relations": [
            "mfer"
          ]
        },
        {
          "name": "mferAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  117,
                  115,
                  101,
                  114,
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
                "path": "mfer"
              }
            ]
          }
        },
        {
          "name": "ownerAta",
          "docs": [
            "The owner's token account for this mint"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "owner"
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
          "name": "mferAuthorityAta",
          "docs": [
            "The token account for the mfer_authority PDA"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mferAuthority"
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
          "docs": [
            "The token mint to withdraw"
          ]
        },
        {
          "name": "tokenProgram",
          "docs": [
            "The token program to use (supports token-2022)"
          ],
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
          "name": "args",
          "type": {
            "defined": {
              "name": "mFerWithdrawArgs"
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
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "protocol"
          ]
        },
        {
          "name": "protocol",
          "docs": [
            "Only protocol owner can initialize an oracle"
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
                  109,
                  102,
                  95,
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
          "name": "pythOracle"
        },
        {
          "name": "tokenMint",
          "docs": [
            "Mint address of the token this oracle is for"
          ]
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
              "name": "initOracleArgs"
            }
          }
        }
      ]
    },
    {
      "name": "protocolFreeze",
      "discriminator": [
        71,
        190,
        129,
        59,
        200,
        188,
        151,
        91
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "protocol"
          ]
        },
        {
          "name": "protocol",
          "writable": true
        }
      ],
      "args": []
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
          "name": "creator",
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
                  109,
                  102,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
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
          "name": "protocolAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
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
                "path": "protocol"
              }
            ]
          }
        },
        {
          "name": "protocolFeeAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  102,
                  95,
                  112,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  95,
                  102,
                  101,
                  101,
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
                "path": "protocol"
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
              "name": "initProtocolArgs"
            }
          }
        }
      ]
    },
    {
      "name": "protocolUnfreeze",
      "discriminator": [
        149,
        246,
        107,
        155,
        245,
        31,
        98,
        99
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "protocol"
          ]
        },
        {
          "name": "protocol",
          "writable": true
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
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "protocol"
          ]
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
                  109,
                  102,
                  95,
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
          "name": "vaultFeeAuthority",
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
                  102,
                  101,
                  101,
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
          "docs": [
            "Vault token account holding the deposit tokens"
          ],
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
          "name": "vaultFeeAuthorityAta",
          "docs": [
            "Fee recipient token account controlled by the vault fee authority"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultFeeAuthority"
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
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "collectFeeArgs"
            }
          }
        }
      ]
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
          "name": "vault",
          "writable": true
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
          "name": "userShareAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
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
          "name": "shareTokenProgram"
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
          "name": "owner",
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
          "name": "vaultFeeAuthority",
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
                  102,
                  101,
                  101,
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
                  109,
                  102,
                  95,
                  115,
                  112,
                  111,
                  114,
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
          "name": "vaultFeeAuthorityAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "vaultFeeAuthority"
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
          "name": "shareTokenProgram"
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
              "name": "initVaultArgs"
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
                  109,
                  102,
                  95,
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
                  109,
                  102,
                  95,
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
                  109,
                  102,
                  95,
                  115,
                  112,
                  111,
                  114,
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
                  109,
                  102,
                  95,
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
                  109,
                  102,
                  95,
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
                  109,
                  102,
                  95,
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
                  109,
                  102,
                  95,
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
                  109,
                  102,
                  95,
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
                  109,
                  102,
                  95,
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
                  109,
                  102,
                  95,
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
          "name": "depositTokenPythOracle"
        },
        {
          "name": "depositTokenMint"
        },
        {
          "name": "depositTokenProgram",
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
                  109,
                  102,
                  95,
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
          "name": "owner",
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
          "name": "vault",
          "writable": true
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
          "name": "userShareAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
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
          "name": "shareTokenProgram"
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
      "name": "mFer",
      "discriminator": [
        114,
        82,
        108,
        224,
        178,
        222,
        183,
        237
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
      "name": "priceUpdateV2",
      "discriminator": [
        34,
        241,
        35,
        99,
        157,
        126,
        244,
        205
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
      "msg": "Invalid AccountDiscriminator"
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
      "name": "accountInvalid",
      "msg": "Account Invalid"
    },
    {
      "code": 6011,
      "name": "accountNotInitialized",
      "msg": "Account not initialized"
    },
    {
      "code": 6012,
      "name": "accountVersionUnallowed",
      "msg": "Account version unallowed"
    },
    {
      "code": 6013,
      "name": "protocolNotSupported",
      "msg": "Activity on the protocol is not supported"
    },
    {
      "code": 6014,
      "name": "protocolNotActivated",
      "msg": "Vault activity on the protocol not activated"
    },
    {
      "code": 6015,
      "name": "spotPositionSlotAlreadyActive",
      "msg": "Spot position slot already active"
    },
    {
      "code": 6016,
      "name": "spotPositionSlotNotActive",
      "msg": "Spot position slot not active"
    },
    {
      "code": 6017,
      "name": "invalidSpotPositionSlot",
      "msg": "Invalid spot position slot"
    },
    {
      "code": 6018,
      "name": "spotPositionNotFound",
      "msg": "Spot position not found"
    },
    {
      "code": 6019,
      "name": "maxSpotPositionReached",
      "msg": "Max spot position reached"
    },
    {
      "code": 6020,
      "name": "spotPositionMismatch",
      "msg": "Spot position mismatch"
    },
    {
      "code": 6021,
      "name": "spotPositionNotEmpty",
      "msg": "Spot position not empty"
    },
    {
      "code": 6022,
      "name": "obligationSlotAlreadyActive",
      "msg": "obligation slot already active"
    },
    {
      "code": 6023,
      "name": "obligationSlotNotActive",
      "msg": "obligation slot not active"
    },
    {
      "code": 6024,
      "name": "invalidObligationSlot",
      "msg": "invalid obligation slot"
    },
    {
      "code": 6025,
      "name": "obligationNotFound",
      "msg": "obligation not found"
    },
    {
      "code": 6026,
      "name": "maxObligationReached",
      "msg": "max obligation reached"
    },
    {
      "code": 6027,
      "name": "obligationMismatch",
      "msg": "obligation mismatch"
    },
    {
      "code": 6028,
      "name": "zeroAmountNotAllowed",
      "msg": "zero amount not allowed"
    },
    {
      "code": 6029,
      "name": "insufficientLiquidity",
      "msg": "vault liquidity insufficient for withdrawal"
    },
    {
      "code": 6030,
      "name": "insufficientSolToWrap",
      "msg": "Insufficient SOL to wrap"
    },
    {
      "code": 6031,
      "name": "insufficientWSolToUnwrap",
      "msg": "Insufficient WSOL to unwrap"
    },
    {
      "code": 6032,
      "name": "protocolFrozen",
      "msg": "Protocol is frozen"
    },
    {
      "code": 6033,
      "name": "mFerFrozen",
      "msg": "MirrorFi User is frozen"
    },
    {
      "code": 6034,
      "name": "vaultFrozen",
      "msg": "Vault is frozen"
    },
    {
      "code": 6035,
      "name": "navNotRefreshed",
      "msg": "Vault NAV has not been refreshed"
    },
    {
      "code": 6036,
      "name": "obligationNotRefreshed",
      "msg": "Obligation has not been refreshed"
    },
    {
      "code": 6037,
      "name": "insufficientFunds",
      "msg": "Insufficient funds"
    },
    {
      "code": 6038,
      "name": "invalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6039,
      "name": "invalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6040,
      "name": "invalidDestinationAccount",
      "msg": "Invalid destination account"
    },
    {
      "code": 6041,
      "name": "operationNotAllowed",
      "msg": "Operation not allowed"
    },
    {
      "code": 6042,
      "name": "zeroWithdrawalUnallowed",
      "msg": "Zero Withdrawal is not allowed"
    },
    {
      "code": 6043,
      "name": "zeroDepositUnallowed",
      "msg": "Zero Deposit is not allowed"
    },
    {
      "code": 6044,
      "name": "depositTooSmall",
      "msg": "Deposit amount is too small"
    },
    {
      "code": 6045,
      "name": "depositTooLarge",
      "msg": "Deposit amount is too large"
    },
    {
      "code": 6046,
      "name": "withdrawalTooSmall",
      "msg": "Withdrawal amount is too small"
    },
    {
      "code": 6047,
      "name": "withdrawalTooLarge",
      "msg": "Withdrawal amount is too large"
    }
  ],
  "types": [
    {
      "name": "collectFeeArgs",
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
      "name": "initOracleArgs",
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
      "name": "initProtocolArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "protocolFeeRate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initVaultArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "name",
            "type": "bytes"
          },
          {
            "name": "managerFeeRate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "kaminoInitObligationArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tag",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u8"
          }
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
      "name": "mFer",
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
              "Protocol associated with the user"
            ],
            "type": "pubkey"
          },
          {
            "name": "owner",
            "docs": [
              "Address of the user owner"
            ],
            "type": "pubkey"
          },
          {
            "name": "mferAuthority",
            "docs": [
              "User Authority (PDA)"
            ],
            "type": "pubkey"
          },
          {
            "name": "referrer",
            "docs": [
              "Referrer"
            ],
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "docs": [
              "Timestamp when the user was created"
            ],
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "docs": [
              "Timestamp when the user was updated"
            ],
            "type": "i64"
          },
          {
            "name": "padding1",
            "docs": [
              "Padding for future use"
            ],
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          },
          {
            "name": "isInitialized",
            "docs": [
              "Is the vault initialized"
            ],
            "type": "bool"
          },
          {
            "name": "freeze",
            "type": "bool"
          },
          {
            "name": "version",
            "docs": [
              "Version of the vault"
            ],
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
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "mFerDepositArgs",
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
      "name": "mFerWithdrawArgs",
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
      "name": "priceFeedMessage",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "feedId",
            "docs": [
              "`FeedId` but avoid the type alias because of compatibility issues with Anchor's `idl-build` feature."
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "price",
            "type": "i64"
          },
          {
            "name": "conf",
            "type": "u64"
          },
          {
            "name": "exponent",
            "type": "i32"
          },
          {
            "name": "publishTime",
            "docs": [
              "The timestamp of this price update in seconds"
            ],
            "type": "i64"
          },
          {
            "name": "prevPublishTime",
            "docs": [
              "The timestamp of the previous price update. This field is intended to allow users to",
              "identify the single unique price update for any moment in time:",
              "for any time t, the unique update is the one such that prev_publish_time < t <= publish_time.",
              "",
              "Note that there may not be such an update while we are migrating to the new message-sending logic,",
              "as some price updates on pythnet may not be sent to other chains (because the message-sending",
              "logic may not have triggered). We can solve this problem by making the message-sending mandatory",
              "(which we can do once publishers have migrated over).",
              "",
              "Additionally, this field may be equal to publish_time if the message is sent on a slot where",
              "where the aggregation was unsuccesful. This problem will go away once all publishers have",
              "migrated over to a recent version of pyth-agent."
            ],
            "type": "i64"
          },
          {
            "name": "emaPrice",
            "type": "i64"
          },
          {
            "name": "emaConf",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "priceUpdateV2",
      "docs": [
        "A price update account. This account is used by the Pyth Receiver program to store a verified price update from a Pyth price feed.",
        "It contains:",
        "- `write_authority`: The write authority for this account. This authority can close this account to reclaim rent or update the account to contain a different price update.",
        "- `verification_level`: The [`VerificationLevel`] of this price update. This represents how many Wormhole guardian signatures have been verified for this price update.",
        "- `price_message`: The actual price update.",
        "- `posted_slot`: The slot at which this price update was posted."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "writeAuthority",
            "type": "pubkey"
          },
          {
            "name": "verificationLevel",
            "type": {
              "defined": {
                "name": "verificationLevel"
              }
            }
          },
          {
            "name": "priceMessage",
            "type": {
              "defined": {
                "name": "priceFeedMessage"
              }
            }
          },
          {
            "name": "postedSlot",
            "type": "u64"
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
            "name": "isInitialized",
            "type": "bool"
          },
          {
            "name": "freeze",
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
            "type": "bool"
          },
          {
            "name": "isMeteora",
            "type": "bool"
          },
          {
            "name": "isOrca",
            "type": "bool"
          },
          {
            "name": "isDrift",
            "type": "bool"
          },
          {
            "name": "reservedProtocols",
            "docs": [
              "Reserved space for future protocol integrations"
            ],
            "type": {
              "array": [
                "bool",
                12
              ]
            }
          },
          {
            "name": "creator",
            "docs": [
              "Address of protocol's creator"
            ],
            "type": "pubkey"
          },
          {
            "name": "owner",
            "docs": [
              "Update authority of protocol state"
            ],
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "docs": [
              "Creation timestamp of protocol"
            ],
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "docs": [
              "Last updated timestamp of the protocol"
            ],
            "type": "i64"
          },
          {
            "name": "protocolFeeAuthority",
            "docs": [
              "Fee Authority of the protocol"
            ],
            "type": "pubkey"
          },
          {
            "name": "protocolFeeRate",
            "docs": [
              "The Fee Rate of the protocol, 1000 = 1% (decimal = 3)"
            ],
            "type": "u64"
          },
          {
            "name": "padding",
            "docs": [
              "Extra Space"
            ],
            "type": {
              "array": [
                "u64",
                64
              ]
            }
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
            "name": "protocolFeeRate",
            "type": "u64"
          },
          {
            "name": "isKamino",
            "type": "bool"
          },
          {
            "name": "isMeteora",
            "type": "bool"
          },
          {
            "name": "isOrca",
            "type": "bool"
          },
          {
            "name": "isDrift",
            "type": "bool"
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
            "name": "amount",
            "type": "u64"
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
            "name": "freeze",
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
            "name": "isOrca",
            "type": "bool"
          },
          {
            "name": "isDrift",
            "type": "bool"
          },
          {
            "name": "reservedProtocols",
            "type": {
              "array": [
                "u8",
                15
              ]
            }
          },
          {
            "name": "name",
            "docs": [
              "Name of the vault (32 bytes)"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
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
            "name": "vaultFeeAuthority",
            "docs": [
              "Vault fee authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "protocolFeeAuthority",
            "docs": [
              "Protocol fee authority"
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
            "name": "lastNavUpdateAt",
            "docs": [
              "Timestamp of last NAV update"
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
            "name": "lastNav",
            "docs": [
              "Last calculated Net Asset Value"
            ],
            "type": "u64"
          },
          {
            "name": "totalDepositAmount",
            "docs": [
              "Total amount deposited into the vault"
            ],
            "type": "u64"
          },
          {
            "name": "totalWithdrawAmount",
            "docs": [
              "Total amount withdrawn from the vault"
            ],
            "type": "u64"
          },
          {
            "name": "totalDepositCount",
            "docs": [
              "Total number of deposit transactions"
            ],
            "type": "u64"
          },
          {
            "name": "totalWithdrawCount",
            "docs": [
              "Total number of withdraw transactions"
            ],
            "type": "u64"
          },
          {
            "name": "totalYield",
            "docs": [
              "Total yield generated"
            ],
            "type": "u64"
          },
          {
            "name": "totalManagerFee",
            "docs": [
              "Total fees paid to the manager"
            ],
            "type": "u64"
          },
          {
            "name": "totalProtocolFee",
            "docs": [
              "Total fees paid to the protocol"
            ],
            "type": "u64"
          },
          {
            "name": "avgIndex",
            "docs": [
              "Average Share Index Price"
            ],
            "type": "u64"
          },
          {
            "name": "delegatee1",
            "docs": [
              "Authorized account to manage the vault"
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
                192
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
    },
    {
      "name": "verificationLevel",
      "docs": [
        "Pyth price updates are bridged to all blockchains via Wormhole.",
        "Using the price updates on another chain requires verifying the signatures of the Wormhole guardians.",
        "The usual process is to check the signatures for two thirds of the total number of guardians, but this can be cumbersome on Solana because of the transaction size limits,",
        "so we also allow for partial verification.",
        "",
        "This enum represents how much a price update has been verified:",
        "- If `Full`, we have verified the signatures for two thirds of the current guardians.",
        "- If `Partial`, only `num_signatures` guardian signatures have been checked.",
        "",
        "# Warning",
        "Using partially verified price updates is dangerous, as it lowers the threshold of guardians that need to collude to produce a malicious price update."
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "partial",
            "fields": [
              {
                "name": "numSignatures",
                "type": "u8"
              }
            ]
          },
          {
            "name": "full"
          }
        ]
      }
    }
  ]
};
