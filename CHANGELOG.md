# v5.2.2
[2024-03-29]

### Changes

* Updated dependencies ([`9d9af6f`](https://github.com/panates/valgen/commit/9d9af6fadeece926a8ec1bc93d14ffc7ace625d0))
* Updated dependencies ([`636ce75`](https://github.com/panates/valgen/commit/636ce759e83e765661e7c5c8730c6b824076d344))

# v5.2.1
[2024-03-27]

### Changes

* Updated dependencies ([`117bab5`](https://github.com/panates/valgen/commit/117bab58f731c1572959668dd4d6fca36d779433))

# v5.2.0
[2024-01-04]

### Changes

* Now validator options persist in context ([`418901f`](https://github.com/panates/valgen/commit/418901f74ee266d84e50ee82ba5a7221bd2be627))

# v5.1.0
[2023-12-23]

### Changes

* Moved from "dayjs" to "date-fns" ([`fd240af`](https://github.com/panates/valgen/commit/fd240afe3cdbb7485695d204aa25b9bf62ad315a))

# v5.0.1
[2023-12-23]

### Changes

* Added new rules ([`ddcab7c`](https://github.com/panates/valgen/commit/ddcab7c54c287a9ec839c04302faa6b3bf5e554d))
* Moved all validator factories into "factories" namespace, ([`2ac5abd`](https://github.com/panates/valgen/commit/2ac5abd7f2097de4ec769bcc55034636142ee598))

# v5.0.0
[2023-12-21]

### Changes

* Moved all validator factories into "factories" namespace, ([`e93dddd`](https://github.com/panates/valgen/commit/e93dddd7aa3aa3bcdfbf9fa1615f9504fbff7e6f))

# v4.3.2
[2023-12-08]

### Changes

* Updated dependenices ([`a539d1b`](https://github.com/panates/valgen/commit/a539d1b6d2d3629174e3d14efee58aacb4e6730a))
* Pass "_this" parameter to preValidation and postValidation methods ([`bdb6a97`](https://github.com/panates/valgen/commit/bdb6a97ed50b538fad97ed1fb2161f8665647214))

# v4.3.1
[2023-12-04]

### Changes

* Made preValidation and postValidation static ([`71fa530`](https://github.com/panates/valgen/commit/71fa53050428fc937dcdda24cb9a43baf0f2d384))

# v4.3.0
[2023-12-02]

### Changes

* Updated dependencies ([`4ff01f0`](https://github.com/panates/valgen/commit/4ff01f0f52c7efeab0c3e154946ba32d1cf04e86))
* Added [preValidation] and [postValidation] to isObject rule ([`2f8351d`](https://github.com/panates/valgen/commit/2f8351d10fd1a9cc78577c52b37681319f3d28b2))

# v4.2.5
[2023-11-27]

### Changes

* Fixed isArray error location property. ([`b42ca30`](https://github.com/panates/valgen/commit/b42ca300c9c5a68685a70a9cff895e9ad97eb650))

# v4.2.4
[2023-11-20]

### Changes

* Added json parsing feature to isObject validator ([`0cd128a`](https://github.com/panates/valgen/commit/0cd128ab8bae6e834230004c4b7bf857ce67b76f))

# v4.2.3
[2023-11-20]

### Changes

* Optimized error messages ([`21e29dc`](https://github.com/panates/valgen/commit/21e29dc2eff846fbeccb7737ffe41496bca583c5))

# v4.2.2
[2023-11-15]

### Changes

* Changed "trim" option ([`b5eff4f`](https://github.com/panates/valgen/commit/b5eff4ffd61eb78ea244dfe2c66ca86275b9578c))

# v4.2.1
[2023-11-15]

### Changes

* Fixed generating invalid date string ([`6407ac6`](https://github.com/panates/valgen/commit/6407ac6bd17bf84a8d031efe9b3998d58c5b7f8b))

# v4.2.0
[2023-11-15]

### Changes

* Removed "format" option and added "precision" option to isDate validator ([`2e332a6`](https://github.com/panates/valgen/commit/2e332a6fb9907e0b50f98a6dbcbbdfb3764af867))
* Added test for "label" option ([`162f41a`](https://github.com/panates/valgen/commit/162f41ac36762a146718c3efc4784bb33f48c955))

# v4.1.0
[2023-10-31]

### Changes

* Updated validation messages. ([`066fc4e`](https://github.com/panates/valgen/commit/066fc4e0f9fc7a0c0543572cf543c66084611135))

# v4.0.1
[2023-10-24]

### Changes

* Added "coerce" option to isNull and isUndefined rules ([`8c02040`](https://github.com/panates/valgen/commit/8c02040264174e26c840fce351da8b69e664d626))

# v4.0.0
[2023-08-17]

### Changes

* Initial release of v4.0.0-alpha.1 ([`499af8e`](https://github.com/panates/valgen/commit/499af8eed81feeacb4bba5c254fbf1ede3933564))
* Implemented all initial validators and tests ([`0ff5c5c`](https://github.com/panates/valgen/commit/0ff5c5c28aa59b44de90d016e8c056c26b3b479d))
* Updated dependencies ([`804e00c`](https://github.com/panates/valgen/commit/804e00c3fcf344f4dcdb96efe0fc94ea3521cb92))
* Better error handling ([`91dae2f`](https://github.com/panates/valgen/commit/91dae2f260f1d02ff5ed418f3247b452c1fed214))
* Updated deps ([`df1cb70`](https://github.com/panates/valgen/commit/df1cb700a3799f09305af774c05ca534e5f88870))
* Added isBigint validator ([`87ba007`](https://github.com/panates/valgen/commit/87ba00753dc018a4bd06492ec99fa37967046c58))
* Fixed isObject coerce issue ([`47c7d4e`](https://github.com/panates/valgen/commit/47c7d4ed2d0e483788e939b357995a156ac3b7bc))
* Improved isDateString ([`59d0d14`](https://github.com/panates/valgen/commit/59d0d14909132a502a9880cc11b9303897a3c79a))
* Updated dayjs ([`e212dd2`](https://github.com/panates/valgen/commit/e212dd2834a07015fcceede3bf211f2a9db11eb6))
* Updated deps ([`d20588e`](https://github.com/panates/valgen/commit/d20588eaa51be7547655d3494bb42e35cb6effa8))
* Updated deps ([`82a2c0d`](https://github.com/panates/valgen/commit/82a2c0dc36c9cc54667231e88dfec6521097a157))
* Fixed isObject coerce issue ([`b79833b`](https://github.com/panates/valgen/commit/b79833ba032494a18a91b1569da2d244f3c4c4b9))
