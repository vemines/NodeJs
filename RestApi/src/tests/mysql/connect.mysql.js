'use strict'

const mysql = require('mysql2')

// createa connection to pool server
const pool = mysql.createPool({
    host: 'localhost',
    port: 8811,
    user: 'root',
    password: '123412',
    database: 'test'
})

const batchSize = 100000; // adjust batch size
const totalSize = 10_000_000; // adjust total size
let currentId = 1;

console.time('::::::::::::TIMER::::::::::::::::')

const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++
    }

    if (!values.length) {
        console.timeEnd('::::::::::::TIMER::::::::::::::::')
        pool.end(err => {
            if (err) {
                console.log('error when runing batch')
            } else {
                console.log('batch run success')
            }
        })        return;
    }

    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`
    pool.query(sql, [values], async function (err, results) {
        if (err) throw err
        console.log(`Inserted ${results.affectedRows} records`);
        await insertBatch()
    })
}

insertBatch().catch(console.error)