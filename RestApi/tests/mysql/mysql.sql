# Insert 10 000 000 row

CREATE TABLE test_table (
id int NOT NULL,
name varchar(255) DEFAULT NULL,
age int DEFAULT NULL,
address varchar(255) DEFAULT NULL,
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

select count(1) from test_table

# PARTITION

// create table order with 4 PARTITION by order_date
CREATE TABLE orders (
    order_id INT, 
    order_date DATE NOT NULL,
    total_amount DECIMAL(10,2),
    PRIMARY KEY (order_id, order_date)
)

PARTITION BY RANGE COLUMNS (order_date) (
    PARTITION p0 VALUES LESS THAN ('2022-01-01'), 
    PARTITION p2023 VALUES LESS THAN ('2023-01-01'), 
    PARTITION p2024 VALUES LESS THAN ('2024-01-01'), 
    PARTITION pmax VALUES LESS THAN (MAXVALUE)
)

EXPLAIN SELECT * FROM orders;   // it search all PARTITION(p0, p2023, p2024, pmax)

// insert data
INSERT INTO orders (order_id, order_date, total_amount) VALUES 
(1, '2021-10-10', 100.99),
(2, '2022-10-10', 100.99),
(3, '2023-10-10', 100.99), 
(4, '2024-10-10', 100.99);

EXPLAIN SELECT * FROM orders PARTITION (p2023);     // only take in PARTITION p2023

EXPLAIN SELECT * FROM orders WHERE order_date >= '2022-01-01' AND order_date < '2025-01-01';     // not scan PARTITION p0

