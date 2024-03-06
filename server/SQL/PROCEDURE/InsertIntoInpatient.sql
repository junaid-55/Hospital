CREATE OR REPLACE PROCEDURE insert_into_in_patient(p_appointment_id INT,p_admit_date date) 
AS $$
DECLARE
    p_patient_type VARCHAR(15);
    p_prescription_id INT;
    p_contact_no INT;
BEGIN
    SELECT prescription_id INTO p_prescription_id
    FROM appointment
    WHERE appointment_id = p_appointment_id;

    SELECT patient_type INTO p_patient_type
    FROM prescription
    WHERE prescription_id = p_prescription_id;

    SELECT patient.contact_no INTO p_contact_no
    FROM appointment A JOIN patient ON A.patient_id = patient.patient_id
    WHERE A.appointment_id = p_appointment_id;

    IF p_patient_type = 'In_Patient' THEN
        INSERT INTO in_patient (appointment_id,contact_no,admit_date)
        VALUES (p_appointment_id,p_contact_no,p_admit_date);
    END IF;
END;
$$ LANGUAGE plpgsql;
