CREATE OR REPLACE FUNCTION CheckDrugAdministration(iP_id INT)
RETURNS INT AS $$
DECLARE
    PID INT;
    RESULT int;
BEGIN
    SELECT p.prescription_id INTO PID
    FROM in_patient ip 
    JOIN appointment a ON ip.appointment_id = a.appointment_id
    JOIN prescription p ON a.prescription_id = p.prescription_id
    WHERE ip.in_patient_id = iP_id;

    IF EXISTS (
        SELECT drug_id 
        FROM prescription_drug 
        WHERE prescription_id = PID
        EXCEPT
        (
            SELECT drug_id 
            FROM drug_taken
            WHERE in_patient_id = ip_id AND taken_date = CURRENT_DATE
        )
    ) THEN RESULT = 1;
    ELSE RESULT = 0;
    END IF;
    RETURN RESULT;
END;
$$ LANGUAGE plpgsql;
