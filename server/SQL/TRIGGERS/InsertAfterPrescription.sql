-- Trigger function for out_patient
CREATE OR REPLACE FUNCTION insert_into_out_patient() RETURNS TRIGGER AS $$
DECLARE
    p_patient_type VARCHAR(15);
    p_contact_no VARCHAR(15);
BEGIN
    SELECT patient_type INTO p_patient_type
    FROM prescription
    WHERE prescription_id = NEW.prescription_id;

    SELECT patient.contact_no INTO p_contact_no
    FROM appointment JOIN patient ON appointment.patient_id = patient.patient_id
    WHERE appointment_id = NEW.appointment_id;

    IF p_patient_type = 'Out_Patient' THEN
        INSERT INTO out_patient (appointment_id,contact_no)
        VALUES (NEW.appointment_id,p_contact_no);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER after_prescription_insert_out_patient
AFTER UPDATE OF prescription_id ON appointment
FOR EACH ROW
EXECUTE PROCEDURE insert_into_out_patient();