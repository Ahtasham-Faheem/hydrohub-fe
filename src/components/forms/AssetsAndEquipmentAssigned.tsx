import { Stack } from "@mui/material";
import dayjs from "dayjs";
import { CustomInput } from "../CustomInput";
import { CustomSelect } from "../CustomSelect";
import { CustomDateInput } from "../CustomDateInput";
import { useFormContext } from "../../contexts/FormContext";

export const AssetsAndEquipmentAssigned = () => {
  const { formData, updateFormData } = useFormContext();

  return (
    <Stack spacing={3}>
      {/* Equipment Type + Serial/Asset ID + Assigned Date */}
      <Stack direction="row" spacing={2}>
        <CustomSelect
          label="Equipment Type"
          value={formData.equipmentType || ""}
          onChange={(e) => updateFormData("equipmentType", e.target.value)}
          options={[
            { value: "vehicle", label: "Vehicle" },
            { value: "mobile", label: "Mobile" },
            { value: "delivery_bag", label: "Delivery Bag" },
            { value: "laptop", label: "Laptop" },
            { value: "tablet", label: "Tablet" },
            { value: "uniform", label: "Uniform" },
          ]}
        />
        <CustomInput
          label="Serial / Asset ID"
          placeholder="Enter Asset ID"
          value={formData.assetId || ""}
          onChange={(e) => updateFormData("assetId", e.target.value)}
        />
      </Stack>

      {/* Return Date + Remarks + Issued By */}
      <Stack direction="row" spacing={2}>
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
        <CustomDateInput
          label="Return Date"
          value={formData.returnDate ? dayjs(formData.returnDate) : null}
          onChange={(date) =>
            updateFormData("returnDate", date ? date.format("YYYY-MM-DD") : "")
          }
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        <CustomInput
          label="Remarks"
          placeholder="Condition / Notes"
          value={formData.remarks || ""}
          onChange={(e) => updateFormData("remarks", e.target.value)}
        />
        <CustomSelect
          label="Issued By"
          value={formData.issuedBy || ""}
          onChange={(e) => updateFormData("issuedBy", e.target.value)}
          options={[
            { value: "manager_1", label: "Manager 1" },
            { value: "manager_2", label: "Manager 2" },
            { value: "admin", label: "Admin" },
            { value: "hr_officer", label: "HR Officer" },
          ]}
        />
      </Stack>
    </Stack>
  );
};
