--patient table
CREATE TABLE patient (
    patient_id  SERIAL PRIMARY KEY,
    email VARCHAR(50) not null unique,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    contact_no VARCHAR(14) not null,
    password VARCHAR(10)
);

--department table
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_title VARCHAR(50),
    description TEXT,
    contact_no VARCHAR(14) not null
);

--doctor table
CREATE TABLE doctor (
    doctor_id SERIAL PRIMARY KEY,
    department_id INT, 
    email VARCHAR(50) not null unique,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    experience VARCHAR(50),
    schedule VARCHAR(50),
    title VARCHAR(50),
    contact_no VARCHAR(14) not null,
    consultation_fee INT,
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

--prescription table
CREATE TABLE prescription(
    prescription_id SERIAL PRIMARY KEY,
    patient_type VARCHAR(15),
    disease_name VARCHAR(250),
    date DATE,
    advice TEXT
);

create table prescription_surgery (
    prescription_id int,
    surgery_id int,
    date date,  
    FOREIGN KEY (prescription_id) REFERENCES prescription(prescription_id),
    FOREIGN KEY (surgery_id) REFERENCES surgery(surgery_id)
);

--appointment table
CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
    doctor_id INT, 
    patient_id INT, 
    prescription_id INT,
    type varchar(50),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    contact_no VARCHAR(14) not null,
    appointment_date DATE,
    Foreign key (prescription_id) references prescription(prescription_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
);


--visit table
CREATE TABLE visit (
    visit_id SERIAL PRIMARY KEY,
    doctor_id INT, 
    prescription_id INT,
    in_patient_id INT,
    date DATE,
    foreign key (prescription_id) references prescription(prescription_id),
    foreign key (in_patient_id) references in_patient(in_patient_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
);

--out_patient table
CREATE TABLE out_patient (
    out_patient_id SERIAL PRIMARY KEY,
    appointment_id INT,  
    contact_no VARCHAR(14),
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
);

--in_patient table
CREATE TABLE in_patient (
    in_patient_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    appointment_id INT,
    contact_no VARCHAR(20),
    admit_date DATE,
    discharge_date DATE,
    foreign key (appointment_id) references appointment(appointment_id)
);

--bed_type table
CREATE TABLE bed_type (
    bed_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50),
    description TEXT   
);

--bed table
CREATE TABLE bed (
    bed_id SERIAL PRIMARY KEY,
    bed_type_id int not null,
    ac_type VARCHAR(10),
    price FLOAT,
    FOREIGN key (bed_type_id) REFERENCES bed_type(bed_type_id)
);

--bed_taken_table
CREATE TABLE bed_taken (
    bed_taken_id SERIAL PRIMARY KEY,
    in_patient_id INT, 
    bed_id INT,
    cost FLOAT,
    occupying_date DATE,
    discharge_date DATE,
    FOREIGN KEY (in_patient_id) REFERENCES in_patient(in_patient_id),
--changes made here
    FOREIGN KEY (bed_id) REFERENCES bed(bed_id)
);

--surgery table
CREATE TABLE surgery (
    surgery_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    type VARCHAR(50),
    room_no VARCHAR(50),
    room_name VARCHAR(80),
    price FLOAT
);

--surgery_role
CREATE TABLE surgery_role (
    role_id SERIAL PRIMARY KEY,
    doctor_role VARCHAR(50),
    fees_percentage FLOAT
);

--surgery_taken
CREATE TABLE surgery_taken (
    surgery_taken_id SERIAL PRIMARY KEY,
    in_patient_id INT, 
    surgery_id INT, 
    price FLOAT,
    status VARCHAR(50),
    FOREIGN KEY (in_patient_id) REFERENCES in_patient(in_patient_id),
    FOREIGN KEY (surgery_id) REFERENCES surgery(surgery_id)
);

--doctor_surgery_taken_junction
CREATE TABLE doctor_surgery_taken_junction(
    doctor_id INT,
    surgery_taken_id INT,
    fees FLOAT,
    role_id INT,
    FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
    FOREIGN KEY (role_id) REFERENCES surgery_role(role_id),
    FOREIGN KEY (surgery_taken_id) REFERENCES surgery_taken(surgery_taken_id)
);

--drug table
CREATE TABLE  drug(
    drug_id SERIAL PRIMARY KEY,
    name VARCHAR(250), 
    type VARCHAR(100),
    dosage VARCHAR(50),
    price FLOAT
);

--drug_taken
CREATE TABLE drug_taken (
    drug_taken_id SERIAL PRIMARY KEY,
    drug_id INT, 
    quantity INT, 
    in_patient_id INT,
    price FLOAT,
    --changes made here
    taken_date DATE,
    FOREIGN KEY (drug_id) REFERENCES drug(drug_id),
    FOREIGN KEY (in_patient_id) REFERENCES in_patient(in_patient_id)

);


create table prescription_drug (
    prescription_id int,
    drug_id int,
    dosage varchar(50),
    days int,
    FOREIGN KEY (prescription_id) REFERENCES prescription(prescription_id),
    FOREIGN KEY (drug_id) REFERENCES drug(drug_id)
);

--test table
CREATE TABLE  test(
    test_id SERIAL PRIMARY KEY,
    name VARCHAR(250), 
    type VARCHAR(100),
    price FLOAT
);

--test_taken table
CREATE TABLE test_taken (
    test_taken_id SERIAL PRIMARY KEY,
    test_id INT, 
    --CHANGES MADE HERE
    results BYTEA,
    in_patient_id INT,
    out_patient_id INT,
    price FLOAT,
    FOREIGN KEY (test_id) REFERENCES test(test_id),
    FOREIGN KEY (in_patient_id) REFERENCES in_patient(in_patient_id),
    FOREIGN KEY (out_patient_id) REFERENCES out_patient(out_patient_id)
);

create table prescription_lab (
    prescription_id int,
    test_id int,
    FOREIGN KEY (prescription_id) REFERENCES prescription(prescription_id),
    FOREIGN KEY (test_id) REFERENCES test(test_id)
);
--bill table
CREATE TABLE bill(
    bill_id SERIAL PRIMARY KEY,
    in_patient_id INT,
    out_patient_id INT,
    amount FLOAT,
    status VARCHAR(50),
    bill_type VARCHAR(10),
    FOREIGN KEY (in_patient_id) REFERENCES in_patient(in_patient_id),
    FOREIGN KEY (out_patient_id) REFERENCES out_patient(out_patient_id)
);
