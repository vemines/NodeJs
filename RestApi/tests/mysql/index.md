SELECT version();

# Create table and inserts sample

CREATE TABLE `users` (
    `usr_id` int NOT NULL AUTO_INCREMENT,
    `usr_age INT DEFAULT '0',
    `usr_status` INT DEFAULT '0',
    `usr_name` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL, `usr_email` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL, `usr_address` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL, KEY IDX
    --
    PRIMARY KEY (`usr_id`),
    KEY `idx_email_age_name` (`usr_email`, `usr_age`, `usr_name`),
    KEY `idx_status` (`usr_status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_bin;

INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address ) VALUES 
( 1, 36, 1, 'Messi', 'messi@anonystick.com', '137, HCM city');
INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address) VALUES 
( 2, 38, 0, 'Ronaldo', 'Ronaldo@anonystick.com', '138, HCM city');
INSERT INTO users (usr_id, usr_age, usr_status, usr_name, usr_email, usr_address) VALUES 
( 3, 39, 1, 'AnonyStick', 'AnonyStick@anonystick.com', '139, HCM city');

## idx_email_age_name

// Scan index
EXPLAIN select * from users where usr_email = 'messi@anonystick.com';
EXPLAIN select * from users where usr_email = 'messi@anonystick.com' AND usr_age = 36;
EXPLAIN select * from users where usr_email = 'messi@anonystick.com' AND usr_age = 36 AND usr_name = 'Messi';

// Not Scan index
EXPLAIN select * from users where usr_age = 36;
EXPLAIN select * from users where usr_name = 'Messi';
EXPLAIN select * from users where usr_name = 'Messi' AND usr_age = 36;

// Not select * for Scan index
EXPLAIN select usr_email, usr_name from users where usr_name = 'Messi';

// Don't math on PRIMARY (index not work)
EXPLAIN select * from users where usr_id + 1 = 2;

## idx_status
EXPLAIN select * from users where usr_status = 1;
EXPLAIN select * from users where usr_status = '1';             // have index
EXPLAIN select * from users where substr(usr_status, 1, 2) = 1; // same result but index not work

## Like %
EXPLAIN select * from users where usr_email like 'messi@%';     // index work
EXPLAIN select * from users where usr_email like '%messi@%';    // index not work

## or
EXPLAIN select * from users where usr_status = 1 or usr_status = 1;                                       // index work
EXPLAIN select * from users where usr_status = 1 or usr_status = 1 or use_address = '137, HCM city';      // index not work


## order by
EXPLAIN select * from users where usr_email = 'messi@anonystick.com' order by usr_email, usr_name;  // index work
EXPLAIN select * from users order by usr_email, usr_name;                                           // index not work


