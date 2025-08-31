export type Spliter = {
    "address": "sPitpiqrhcuAgu8Ss9Bv2YEpkYhnKdDQeSYW65DSMcd",
    "metadata": {
        "name": "spliter",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "contributeSplit",
            "discriminator": [
                62,
                241,
                205,
                13,
                244,
                142,
                109,
                107
            ],
            "accounts": [
                {
                    "name": "split",
                    "writable": true
                },
                {
                    "name": "contributor",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "createSplit",
            "discriminator": [
                196,
                195,
                250,
                188,
                17,
                255,
                10,
                151
            ],
            "accounts": [
                {
                    "name": "splitAuthority",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "split",
                    "writable": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "receiver",
                    "type": "pubkey"
                },
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "totalAmount",
                    "type": "u64"
                },
                {
                    "name": "contributors",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "spliter"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "releaseSplit",
            "discriminator": [
                51,
                139,
                250,
                190,
                137,
                198,
                127,
                246
            ],
            "accounts": [
                {
                    "name": "split",
                    "writable": true
                },
                {
                    "name": "splitAuthority",
                    "writable": true,
                    "signer": true,
                    "relations": [
                        "split"
                    ]
                },
                {
                    "name": "receiver",
                    "writable": true,
                    "relations": [
                        "split"
                    ]
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "split",
            "discriminator": [
                166,
                254,
                141,
                46,
                23,
                221,
                129,
                195
            ]
        }
    ],
    "events": [
        {
            "name": "contributeEvent",
            "discriminator": [
                147,
                4,
                47,
                213,
                204,
                84,
                46,
                189
            ]
        },
        {
            "name": "createSplitEvent",
            "discriminator": [
                25,
                108,
                74,
                211,
                99,
                158,
                155,
                159
            ]
        },
        {
            "name": "releasePaymentEvent",
            "discriminator": [
                22,
                178,
                1,
                219,
                133,
                6,
                142,
                78
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "splitNotFound",
            "msg": "Split not found"
        },
        {
            "code": 6001,
            "name": "nameTooLong",
            "msg": "Split name exceeds maximum allowed length (50 characters)"
        },
        {
            "code": 6002,
            "name": "invalidName",
            "msg": "Split name should atleast contain 1 character"
        },
        {
            "code": 6003,
            "name": "arithmeticOverflow",
            "msg": "Math overflow occurred"
        },
        {
            "code": 6004,
            "name": "targetNotReached",
            "msg": "Target amount not yet reached"
        },
        {
            "code": 6005,
            "name": "invalidBump",
            "msg": "Missing or invalid bump"
        },
        {
            "code": 6006,
            "name": "contributorCountMismatch",
            "msg": "Contributor count mismatch"
        },
        {
            "code": 6007,
            "name": "invalidContributorAccount",
            "msg": "Invalid contributor account"
        },
        {
            "code": 6008,
            "name": "tooManyContributors",
            "msg": "Contributor count should be less than 255"
        },
        {
            "code": 6009,
            "name": "unauthorized",
            "msg": "Unauthorized action"
        },
        {
            "code": 6010,
            "name": "invalidReceiver",
            "msg": "Invalid receiver account"
        },
        {
            "code": 6011,
            "name": "insufficientFunds",
            "msg": "Insufficient funds in split account"
        },
        {
            "code": 6012,
            "name": "notAContributor",
            "msg": "Caller is not a contributor"
        },
        {
            "code": 6013,
            "name": "alreadyCleared",
            "msg": "Contribution already settled"
        },
        {
            "code": 6014,
            "name": "noContributors",
            "msg": "Contributors list cannot be empty"
        },
        {
            "code": 6015,
            "name": "invalidTotalPercentage",
            "msg": "Total contribution percentage must equal 100"
        },
        {
            "code": 6016,
            "name": "duplicateContributor",
            "msg": "Duplicate contributor detected"
        },
        {
            "code": 6017,
            "name": "zeroPercentage",
            "msg": "Contributor percentage must be greater than zero"
        }
    ],
    "types": [
        {
            "name": "contributeEvent",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "split",
                        "type": "pubkey"
                    },
                    {
                        "name": "contributor",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "totalReceived",
                        "type": "u64"
                    },
                    {
                        "name": "hasCleared",
                        "type": "bool"
                    },
                    {
                        "name": "clearedAt",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "createSplitEvent",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "split",
                        "type": "pubkey"
                    },
                    {
                        "name": "splitName",
                        "type": "string"
                    },
                    {
                        "name": "authority",
                        "type": "pubkey"
                    },
                    {
                        "name": "receiver",
                        "type": "pubkey"
                    },
                    {
                        "name": "totalAmount",
                        "type": "u64"
                    },
                    {
                        "name": "contributorCount",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "releasePaymentEvent",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "split",
                        "type": "pubkey"
                    },
                    {
                        "name": "receiver",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "releasedAt",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "split",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "splitAuthority",
                        "type": "pubkey"
                    },
                    {
                        "name": "splitName",
                        "type": "string"
                    },
                    {
                        "name": "receiver",
                        "type": "pubkey"
                    },
                    {
                        "name": "splitAmount",
                        "type": "u64"
                    },
                    {
                        "name": "contributors",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "spliter"
                                }
                            }
                        }
                    },
                    {
                        "name": "receivedAmount",
                        "type": "u64"
                    },
                    {
                        "name": "isReleased",
                        "type": "bool"
                    },
                    {
                        "name": "releasedAt",
                        "type": "i64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "spliter",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "contributor",
                        "type": "pubkey"
                    },
                    {
                        "name": "percent",
                        "type": "u8"
                    },
                    {
                        "name": "hasCleared",
                        "type": "bool"
                    },
                    {
                        "name": "clearedAt",
                        "type": "i64"
                    }
                ]
            }
        }
    ]
};
