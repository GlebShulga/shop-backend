import "source-map-support/register";
import { createProduct } from "./handlers/createProduct";
import { getProductList } from "./handlers/getProductList";
import { getProductById } from "./handlers/getProductById";
import { catalogBatchProcess } from './handlers/catalogBatchProcess';

export { createProduct, getProductList, getProductById, catalogBatchProcess };
