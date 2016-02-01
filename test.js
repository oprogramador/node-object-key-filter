/**
 * Copyright (c) 2014 Tim Kuijsten
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

'use strict';

var assert = require('assert');
var filter = require('./index');

// should require obj to be an object
assert.throws(function() { filter(); }, /obj must be an object/);

// should require keys to be an array
assert.throws(function() { filter({}); }, /keys must be an array/);

// should require recurse to be a boolean
assert.throws(function() { filter({}, [], []); }, /recurse must be a boolean/);

// should work with empty object
var obj = {};
assert.deepEqual(filter(obj, []), {});

// should filter multiple keys
var obj = { $: '$', foo: 'bar', '%': 'bar' };
assert.deepEqual(filter(obj, ['foo', '%']), { $: '$' });

// should not recurse
var obj = { $: '$', foo: { $: '$' } };
assert.deepEqual(filter(obj, ['$']), { foo: { $: '$' } });

// should recurse with null (regression)
var obj = { $: '$', foo: { $: null, bar: { some: 'other' } }, a: 'b' };
assert.deepEqual(filter(obj, ['$'], true), { foo: { bar: { some: 'other' } } , a: 'b' });

// should not recurse into an array (regression)
var obj = { $: '$', foo: { $: ['a', 'b'], bar: { some: ['a', 'b'] } }, a: 'b' };
assert.deepEqual(filter(obj, ['$'], true), { foo: { bar: { some: ['a', 'b'] } } , a: 'b' });
assert(Array.isArray(filter(obj, ['$'], true).foo.bar.some));

// should recurse
var obj = { $: '$', foo: { $: '$', bar: { some: 'other' } }, a: 'b' };
assert.deepEqual(filter(obj, ['$'], true), { foo: { bar: { some: 'other' } } , a: 'b' });

// should not have had side-effects
assert.deepEqual(obj, { $: '$', foo: { $: '$', bar: { some: 'other' } }, a: 'b' });

console.log('ok');
