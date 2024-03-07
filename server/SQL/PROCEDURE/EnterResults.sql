CREATE OR REPLACE PROCEDURE enter_results(
    p_test_id INT,
    p_results BYTEA,
    p_appointment_id INT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_in_patient_id INT;
    v_price FLOAT;
BEGIN
    SELECT in_patient_id INTO v_in_patient_id 
    FROM in_patient WHERE appointment_id = p_appointment_id;
    SELECT price INTO v_price 
    FROM test WHERE test_id = p_test_id;

    INSERT INTO test_taken(test_id, results, in_patient_id, price) 
    VALUES(p_test_id, p_results, v_in_patient_id, v_price);
END;
$$;