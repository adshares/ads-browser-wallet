# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.8] - 2022-06-07
### Added
- Converting into USD current account balance and when creating a transaction
### Fixed
- Format recipient address
- Format text message in authentication transaction

## [0.4.7] - 2021-12-17
### Changed
- Rename authentication `nonce` to `message`

## [0.4.6] - 2021-11-23
### Fixed
- Authentication secret key error

## [0.4.5] - 2021-11-22
### Added
- Unwrap link
### Removed
- New tab proxy option
### Fixed
- Missing secret key error

## [0.4.4] - 2021-11-15
### Changed
- Prevent importing accounts without keys
### Removed
- Key selector when signing
### Fixed
- Delayed loading of accounts when signing

## [0.4.3] - 2021-11-05
### Added
- Authentication with wallet
- Broadcast from JS client
- Send one from JS client
### Changed
- Wrap summary page
### Fixed
- Out of sync transaction time
- Account name validation

## [0.4.2] - 2021-06-08
### Added
- Gateway fee threshold
### Fixed
- Gateway form validation

## [0.4.1] - 2021-05-06
### Fixed
- Undefined gateways error

## [0.4.0] - 2021-05-06
### Added
- ADS Error info support
- Automatic account finder
- Wrapped ADS support

## [0.3.2] - 2019-03-22
### Removed
- npm lock file

## [0.3.1] - 2019-02-25
### Added
- Free coins info
### Fixed
- Calculation of the fee

## [0.3.0] - 2019-01-30
### Added
- Firefox extension support
- Transaction fee info
- Account balance in selector and transfer form
- Automatic key generation during account import
### Changed
- Password min length info on restore page
- Build process
### Removed
- Password validation during adding items

## [0.2.1] - 2019-01-16
### Added
- Account menu chevron
### Fixed
- Master key settings
- Icons background
- Page scroll
- Manifest permissions

## [0.2.0] - 2019-01-15
### Added
- Free accounts support
- Broadcast support
- Privacy policy
- Dev config support
### Fixed
- Swinging buttons after submit

### [0.1.1] - 2019-01-11
### Added
- Store form temporary state
### Changed
- Password length set to 8 chars
### Fixed
- Location preservation

### [0.1.0] - 2019-01-10
### Added
- Creating transactions
- Signing transactions
- External apps supports
- JSON-RPC integration
- Keys management
- Accounts management
- Session support
- Storage encryption
- Docs

[Unreleased]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.8...HEAD

[0.4.8]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.7...v0.4.8
[0.4.7]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.6...v0.4.7
[0.4.6]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.5...v0.4.6
[0.4.5]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.4...v0.4.5
[0.4.4]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/adshares/ads-browser-wallet/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/adshares/ads-browser-wallet/compare/v0.3.2...v0.4.0
[0.3.2]: https://github.com/adshares/ads-browser-wallet/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/adshares/ads-browser-wallet/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/adshares/ads-browser-wallet/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/adshares/ads-browser-wallet/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/adshares/ads-browser-wallet/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/adshares/ads-browser-wallet/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/adshares/ads-browser-wallet/releases/tag/v0.1.0
