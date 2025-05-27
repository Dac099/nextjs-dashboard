import { ProjectFormData, Currency } from "@/utils/types/projectDetail";
import styles from "./projectForm.module.css";
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

type Props = {
  projectFormData: ProjectFormData;
  setProjectFormData: (data: ProjectFormData) => void;
  currencies: Currency[];
};

export function BudgetProject({
  projectFormData,
  setProjectFormData,
  currencies,
}: Props) {

  const calculateTotalBudget = (): number => {
    const { otherBudget, machineBudget, electricalBudget, mechanicalBudget } = projectFormData;
    return (
      otherBudget + machineBudget + electricalBudget + mechanicalBudget
    );
  }

  return (
    <section className={styles.projectInfo}>
      <article>
        <label htmlFor="total-budget" className={styles.inputTextLabel}>
          Presupuesto total
        </label>
        <div className={`p-inputgroup ${styles.inputGroup}`}>
          <span className="p-inputgroup-addon">$</span>
          <InputNumber
            placeholder="Price"
            disabled
            value={calculateTotalBudget()}
          />
        </div>
      </article>

      <article>
        <label htmlFor="currency" className={styles.inputTextLabel}>
          Moneda
        </label>
        <select
          name="currency"
          id="currency"
          value={projectFormData.currency}
          onChange={(e) =>
            setProjectFormData({
              ...projectFormData,
              currency: e.target.value,
            })
          }
          className={styles.dropdown}
        >
          <option value="">Seleccione una opción</option>
          {currencies.map((currency) => (
            <option key={currency.id} value={currency.id}>
              {currency.name}
            </option>
          ))}
        </select>
      </article>

      <article style={{ paddingTop: "7px" }}>
        <FloatLabel>
          <InputText
            value={projectFormData.linkDrive}
            onChange={(e) =>
              setProjectFormData({
                ...projectFormData,
                linkDrive: e.target.value,
              })
            }
            className={styles.inputText}
            id="url-drive"
          />
          <label htmlFor="url-drive" className={styles.inputTextLabel}>
            Link de drive
          </label>
        </FloatLabel>
      </article>
    </section>
  );
}
