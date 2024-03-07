CREATE OR REPLACE PROCEDURE insert_into_prescription_surgery(
     p_appointment_id INT,
     p_surgery_id INT,
     p_date DATE
) AS $$
DECLARE
    p_prescription_id INT;
BEGIN

    SELECT prescription_id INTO p_prescription_id
    FROM appointment WHERE appointment_id = p_appointment_id;

    IF EXISTS 
        (
            SELECT * FROM prescription_surgery 
            WHERE prescription_id = p_prescription_id 
            AND surgery_id = p_surgery_id
        ) 
    THEN
       UPDATE prescription_surgery SET date = p_date 
       WHERE prescription_id = p_prescription_id AND surgery_id = p_surgery_id;
    ELSE
        INSERT INTO prescription_surgery (prescription_id, surgery_id, date)
        VALUES (p_prescription_id, p_surgery_id, p_date);
    END IF;
END;
$$ LANGUAGE plpgsql;
