CREATE OR REPLACE FUNCTION CheckLabTestAdministration(iP_id INT)
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
        SELECT test_id 
        FROM prescription_lab 
        WHERE prescription_id = PID
        EXCEPT
        (
            SELECT test_id
            FROM test_taken
            WHERE in_patient_id = ip_id 
        )
    ) THEN RESULT = 1;
    ELSE RESULT = 0;
    END IF;
    RETURN RESULT;
END;
$$ LANGUAGE plpgsql;
