CREATE OR REPLACE PROCEDURE insert_into_prescription(
    p_patient_type VARCHAR,
    p_disease_name VARCHAR,
    p_date DATE,
    p_advice TEXT,
    P_appointment_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    FLAG INT;
    new_prescription_id INT;
BEGIN

    SELECT prescription_id INTO FLAG 
    FROM appointment WHERE appointment_id = P_appointment_id;

    IF FLAG IS NULL THEN
        INSERT INTO prescription(patient_type, disease_name, date, advice)
        VALUES (p_patient_type, p_disease_name, p_date, p_advice) RETURNING prescription_id INTO new_prescription_id;
        UPDATE appointment SET prescription_id = new_prescription_id WHERE appointment_id = P_appointment_id;
    ELSE
        UPDATE prescription SET patient_type = p_patient_type, disease_name = p_disease_name, date = p_date, advice = p_advice WHERE prescription_id = FLAG;
    END IF;
    
END;
$$;