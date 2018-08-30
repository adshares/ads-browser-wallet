/**
 * Tests for key derivation test-vector-2-for-ed25519 from
 * https://github.com/satoshilabs/slips/blob/master/slip-0010.md#test-vector-2-for-ed25519
 */
'use strict';

const {derivePath, getMasterKeyFromSeed, getPublicKey} = require('ed25519-hd-key');
const hexSeed = 'fffcf9f6f3f0edeae7e4e1dedbd8d5d2cfccc9c6c3c0bdbab7b4b1aeaba8a5a29f9c999693908d8a8784817e7b7875726f6c696663605d5a5754514e4b484542';

test('master key from seed', () => {
    // Chain m
    //
    // fingerprint: 00000000
    // chain code: ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b
    // private: 171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012
    // public: 008fe9693f8fa62a4305a140b9764c5ee01e455963744fe18204b4fb948249308a
    let chain = getMasterKeyFromSeed(hexSeed);
    expect(chain.key.toString('hex')).toBe('171cb88b1b3c1db25add599712e36245d75bc65a1a5c9e18d76f9f2b1eab4012');
    expect(chain.chainCode.toString('hex')).toBe('ef70a74db9c3a5af931b5fe73ed8e1a53464133654fd55e7a66f8570b8e33c3b');
    expect(getPublicKey(chain.key).toString('hex')).toBe('008fe9693f8fa62a4305a140b9764c5ee01e455963744fe18204b4fb948249308a');
});

test('derivePath m/0\' from seed', () => {
    // Chain m/0H
    //
    // fingerprint: 31981b50
    // chain code: 0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d
    // private: 1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635
    // public: 0086fab68dcb57aa196c77c5f264f215a112c22a912c10d123b0d03c3c28ef1037
    let chain = derivePath("m/0'", hexSeed);
    expect(chain.key.toString('hex')).toBe('1559eb2bbec5790b0c65d8693e4d0875b1747f4970ae8b650486ed7470845635');
    expect(chain.chainCode.toString('hex')).toBe('0b78a3226f915c082bf118f83618a618ab6dec793752624cbeb622acb562862d');
    expect(getPublicKey(chain.key).toString('hex')).toBe('0086fab68dcb57aa196c77c5f264f215a112c22a912c10d123b0d03c3c28ef1037');
});

test('derivePath m/0\'/2147483647\' from seed', () => {
    // Chain m/0H/2147483647H
    //
    // fingerprint: 1e9411b1
    // chain code: 138f0b2551bcafeca6ff2aa88ba8ed0ed8de070841f0c4ef0165df8181eaad7f
    // private: ea4f5bfe8694d8bb74b7b59404632fd5968b774ed545e810de9c32a4fb4192f4
    // public: 005ba3b9ac6e90e83effcd25ac4e58a1365a9e35a3d3ae5eb07b9e4d90bcf7506d
    let chain = derivePath("m/0'/2147483647'", hexSeed);
    expect(chain.key.toString('hex')).toBe('ea4f5bfe8694d8bb74b7b59404632fd5968b774ed545e810de9c32a4fb4192f4');
    expect(chain.chainCode.toString('hex')).toBe('138f0b2551bcafeca6ff2aa88ba8ed0ed8de070841f0c4ef0165df8181eaad7f');
    expect(getPublicKey(chain.key).toString('hex')).toBe('005ba3b9ac6e90e83effcd25ac4e58a1365a9e35a3d3ae5eb07b9e4d90bcf7506d');
});

test('derivePath m/0\'/2147483647\'/1\' from seed', () => {
    // Chain m/0H/2147483647H/1H
    //
    // fingerprint: fcadf38c
    // chain code: 73bd9fff1cfbde33a1b846c27085f711c0fe2d66fd32e139d3ebc28e5a4a6b90
    // private: 3757c7577170179c7868353ada796c839135b3d30554bbb74a4b1e4a5a58505c
    // public: 002e66aa57069c86cc18249aecf5cb5a9cebbfd6fadeab056254763874a9352b45
    let chain = derivePath("m/0'/2147483647'/1'", hexSeed);
    expect(chain.key.toString('hex')).toBe('3757c7577170179c7868353ada796c839135b3d30554bbb74a4b1e4a5a58505c');
    expect(chain.chainCode.toString('hex')).toBe('73bd9fff1cfbde33a1b846c27085f711c0fe2d66fd32e139d3ebc28e5a4a6b90');
    expect(getPublicKey(chain.key).toString('hex')).toBe('002e66aa57069c86cc18249aecf5cb5a9cebbfd6fadeab056254763874a9352b45');
});

test('derivePath m/0\'/2147483647\'/1\'/2147483646\' from seed', () => {
    // Chain m/0H/2147483647H/1H/2147483646H
    //
    // fingerprint: aca70953
    // chain code: 0902fe8a29f9140480a00ef244bd183e8a13288e4412d8389d140aac1794825a
    // private: 5837736c89570de861ebc173b1086da4f505d4adb387c6a1b1342d5e4ac9ec72
    // public: 00e33c0f7d81d843c572275f287498e8d408654fdf0d1e065b84e2e6f157aab09b
    let chain = derivePath("m/0'/2147483647'/1'/2147483646'", hexSeed);
    expect(chain.key.toString('hex')).toBe('5837736c89570de861ebc173b1086da4f505d4adb387c6a1b1342d5e4ac9ec72');
    expect(chain.chainCode.toString('hex')).toBe('0902fe8a29f9140480a00ef244bd183e8a13288e4412d8389d140aac1794825a');
    expect(getPublicKey(chain.key).toString('hex')).toBe('00e33c0f7d81d843c572275f287498e8d408654fdf0d1e065b84e2e6f157aab09b');
});

test('derivePath m/0\'/2147483647\'/1\'/2147483646\'/2\' from seed', () => {
    // Chain m/0H/2147483647H/1H/2147483646H/2H
    //
    // fingerprint: 422c654b
    // chain code: 5d70af781f3a37b829f0d060924d5e960bdc02e85423494afc0b1a41bbe196d4
    // private: 551d333177df541ad876a60ea71f00447931c0a9da16f227c11ea080d7391b8d
    // public: 0047150c75db263559a70d5778bf36abbab30fb061ad69f69ece61a72b0cfa4fc0
    let chain = derivePath("m/0'/2147483647'/1'/2147483646'/2'", hexSeed);
    expect(chain.key.toString('hex')).toBe('551d333177df541ad876a60ea71f00447931c0a9da16f227c11ea080d7391b8d');
    expect(chain.chainCode.toString('hex')).toBe('5d70af781f3a37b829f0d060924d5e960bdc02e85423494afc0b1a41bbe196d4');
    expect(getPublicKey(chain.key).toString('hex')).toBe('0047150c75db263559a70d5778bf36abbab30fb061ad69f69ece61a72b0cfa4fc0');
});
