import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { CustomInput } from "../common/CustomInput";
import { CustomSelect } from "../common/CustomSelect";
import { CustomDateInput } from "../common/CustomDateInput";
import { useFormContext } from "../../contexts/FormContext";

export const AssetsAndEquipmentAssigned = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* Equipment Type + Asset ID + Assigned Date */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Equipment Type"
          value={formData.equipmentType || ""}
          onChange={(e) => updateFormData("equipmentType", e.target.value)}
          options={[
            { value: "Laptop", label: "Laptop" },
            { value: "Vehicle", label: "Vehicle" },
            { value: "Mobile", label: "Mobile" },
            { value: "Delivery Bag", label: "Delivery Bag" },
            { value: "Tablet", label: "Tablet" },
            { value: "Uniform", label: "Uniform" },
          ]}
        />
        <CustomInput
          label="Asset ID"
          placeholder="550e8400-e29b-41d4-a716-446655440000"
          value={formData.assetId || ""}
          onChange={(e) => updateFormData("assetId", e.target.value)}
        />
        <CustomDateInput
          label="Assigned Date"
          value={formData.assignedDate ? dayjs(formData.assignedDate) : null}
          onChange={(date) =>
            updateFormData(
              "assignedDate",
              date ? date.format("YYYY-MM-DD") : ""
            )
          }
        />
      </Stack>

      {/* Quantity + Unit of Measure + Issue By */}
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Quantity"
          type="number"
          placeholder="1"
          value={formData.quantity?.toString() || ""}
          onChange={(e) => updateFormData("quantity", e.target.value)}
        />
        <CustomInput
          label="Unit of Measure"
          placeholder="piece"
          value={formData.unitOfMeasure || ""}
          onChange={(e) => updateFormData("unitOfMeasure", e.target.value)}
        />
        <CustomInput
          label="Issue By"
          placeholder="HR Manager"
          value={formData.issueBy || ""}
          onChange={(e) => updateFormData("issueBy", e.target.value)}
        />
      </Stack>

      {/* Remarks */}
      <CustomInput
        label="Remarks"
        placeholder="Dell Inspiron 15 for field operations"
        multiline
        rows={4}
        value={formData.remarks || ""}
        onChange={(e) => updateFormData("remarks", e.target.value)}
      />
    </Stack>
  );
};
