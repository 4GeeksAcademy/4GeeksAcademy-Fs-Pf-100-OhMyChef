import { DashboardChef } from "../../components/DashboardChef";
import GastosChef from "../../components/GastosChef";


export const ChefVentas = () => {
  return (
    <>


      <div className="row">
        <div className="graficoVentas col-sm-12 col-md-10 col-lg-10 col-xl-8 col-xxl-7 d-flex border ms-4 pt-4 pb-4 mt-2 flex-sm-column flex-md-row">

          <div className="col-sm-12 justify-content-sm-around justify-content-md-start col-md-2 col-lg-2 gastos d-flex flex-sm-row flex-md-column  order-sm-2 order-md-1 ps-sm-0 ps-md-2 mt-sm-5 mb-sm-5 mt-md-0 mb-md-0 fs-5">
            <span>% Gastos</span>
            <span className="d-flex flex-column fs-6 mt-sm-0 mt-md-4">
              <span className="color-green">Gastos actuales</span>
              <span className="mt-2 fs-5 fw-bold text-secondary">2000€</span>
            </span>

            <span className="d-flex flex-column fs-6 mt-sm-0 mt-md-4">
              <span className="color-blue">Porcentaje de gastos</span>
              <span className="caja-azul mt-2 fs-5 fw-bold text-secondary">2000€</span>
            </span>


          </div>
          <div className="col-10  ms-md-4 ms-lg-0 order-sm-1 order-md-2 ">
            <h5 className=" titulo pt-1 ms-sm-0 ms-md-4 ms-4">Gráfica de Ventassss </h5>
            <GastosChef />
          </div>

        </div>
      </div>


    </>
  );
};
