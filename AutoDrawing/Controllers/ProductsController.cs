using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using AutoDrawing.Models.DrawingDemo;
using AutoDrawing.Models.KJERPX;
using Newtonsoft.Json.Linq;
using System.Net;

namespace AutoDrawing.Controllers
{
    public class ProductsController : Controller
    {
        private readonly DrawingDemoContext db;
        private readonly KJERPXContext db2;

        public ProductsController(DrawingDemoContext context, KJERPXContext context2)
        {
            db = context;
            db2 = context2;
        }


        #region [Product]
        public IActionResult Index()
        {
            ViewBag.Equipments = new SelectList(db.Equipments, "Id", "Name");
            ViewBag.XComponents = new SelectList(db2.XComponents.Where(e => e.IsProduct == 1), "ComponentIdx", "Model");
            return View();
        }

        // Search
        public JArray LoadProducts(string search, string category)
        {
            string txt = category??"";


            if (txt.ToUpper() == "MODELS" || txt.ToUpper() == "MANUALS")
                txt = "GOODS";
            else if (txt.ToUpper() == "ALL")
                txt = "";


            var products = db.Products.Include(e => e.Equipment).AsNoTracking()
                .Where(e => e.Completion.Contains(txt) && (e.Equipment.Name.Contains(search ?? "") || e.Model.Contains(search ?? "")));

            int x = products.Count() - 50;

            if (x > 0)
                products = products.OrderBy(e => e.Id).Skip(x);


            JArray arrProduct = new JArray();

            foreach (Product product in products)
            {
                // Category가 Manual이면, Manual이 있는 지 확인하고 없으면 continue
                if (txt.ToUpper() == "MANUALS")
                {
                    var xComponents = db2.XComponents.Where(e => e.Model == product.Model && e.CompTechGroupIdx != null);

                    if (xComponents.Count() != 1)
                        continue;


                    int componentIdx = xComponents.First().ComponentIdx;
                    var xAppComponents = db2.XAppComponents.Where(e => e.ComponentIdx == componentIdx && e.AppCategory == "LIB");


                    foreach (XAppComponent xAppComponent in xAppComponents)
                    {
                        var xLibraries = db2.XLibraries.Where(e => e.LibIdx == xAppComponent.AppIdx);

                        if (xLibraries.Count() == 0)
                            continue;

                        XLibrary xlib = xLibraries.First();


                        var xResource = db2.XResources.Where(e => e.AppIdx == xlib.LibIdx && e.AppCategory == "LIB" && e.IsUrl == 0 && e.FileCategory == "MNL"
                            && e.SubCategory == "IST");

                        if (xResource.Count() == 0)
                            continue;

                        XResource xRes = xResource.First();


                        var xFileRepoes = db2.XFileRepositories.Where(e => e.AppIdx == xRes.ResIdx && e.AppCategory == "RES");

                        if (xFileRepoes.Count() == 0)
                            continue;

                        XFileRepository xFileRepo = xFileRepoes.First();


                        var xFiles = db2.XFiles.Where(e => e.FileIdx == xFileRepo.FileIdx);

                        if (xFiles.Count() == 0)
                            continue;
                    }
                }


                JObject item = new JObject();

                item.Add("ProductId", product.Id);
                item.Add("ProductModel", product.Model);
                item.Add("Title", product.Title);
                item.Add("Completion", product.Completion);
                item.Add("Mass", product.Mass);

                arrProduct.Add(item);
            }
            return arrProduct;
        }

        // Create modal
        public JArray LoadCreateEquipments()
        {
            JArray arrEquipments = new JArray();

            foreach (Equipment equipment in db.Equipments.ToList())
            {
                JObject item = new JObject();

                item.Add("EquipmentId", equipment.Id);
                item.Add("EquipmentName", equipment.Name);

                arrEquipments.Add(item);
            }

            return arrEquipments;
        }
        public void CreateProduct(Product product)
        {
            db.Add(product);

            JObject obProduct = new JObject();
            obProduct.Add("Model", product.Model);
            obProduct.Add("Title", product.Title);
            obProduct.Add("Completion", product.Completion);
            obProduct.Add("EquipmentId", product.EquipmentId);
            obProduct.Add("Mass", product.Mass);
            obProduct.Add("componentIdx", product.ComponentIdx);
            obProduct.Add("State", product.State);
            obProduct.Add("Group", product.Group);
            obProduct.Add("TableCol", product.TableCol);

            Log log = new Log
            {
                RefId = product.Id,
                DataType = "Product",
                Date = DateTime.Now,
                User = User.Identity.Name,
                ChangeData = obProduct.ToString(),
                ActionType = "CreateProduct"
            };

            db.Add(log);
            db.SaveChanges();
        }

        // Edit modal
        public JObject LoadEditProduct(int proId)
        {
            Product product = db.Products.Find(proId);

            JObject obProduct = new JObject();
            obProduct.Add("Id", product.Id);
            obProduct.Add("EquipmentId", product.EquipmentId);
            obProduct.Add("Model", product.Model);
            obProduct.Add("Title", product.Title);
            obProduct.Add("Mass", product.Mass);
            obProduct.Add("Completion", product.Completion);

            return obProduct;
        }
        public void SaveEditProduct(int id, int? equipmentId, string model, string title, string mass, string completion, int? componentIdx)
        {
            if (!ModelState.IsValid)
                return;

            Product product = db.Products.Find(id);
            JObject obProduct = new JObject();

            if (product.EquipmentId != equipmentId)
            {
                product.EquipmentId = equipmentId;
                obProduct.Add("EquipmentId", equipmentId);
            }

            if (product.Model != model)
            {
                product.Model = model;
                obProduct.Add("Model", model);
            }

            if (product.Title != title)
            {
                product.Title = title;
                obProduct.Add("Product", title);
            }

            if (product.Mass != mass)
            {
                product.Mass = mass;
                obProduct.Add("Mass", mass);
            }

            if (product.Completion != completion)
            {
                product.Completion = completion;
                obProduct.Add("Completion", completion);
            }

            if (product.ComponentIdx != componentIdx)
            {
                product.ComponentIdx = componentIdx;
                obProduct.Add("componentIdx", componentIdx);
            }

            TryUpdateModelAsync(product);


            Log log = new Log
            {
                RefId = product.Id,
                DataType = "Product",
                Date = DateTime.Now,
                User = User.Identity.Name,
                ChangeData = obProduct.ToString(),
                ActionType = "EditProduct"
            };

            db.Add(log);
            db.SaveChanges();
        }

        // Delete
        public async Task<string> DeleteProduct(string json)
        {
            JArray arrItems = JArray.Parse(json);

            foreach (int id in arrItems)
            {
                Product product = await db.Products
                    .Include(e => e.WordMaps)
                    .Include(e => e.Children)
                    .Include(e => e.VisioMaps)
                        .ThenInclude(e => e.Shapes)
                            .ThenInclude(e => e.RelationShapes)
                        .Include(e => e.VisioMaps)
                            .ThenInclude(e => e.Relations)
                    .FirstOrDefaultAsync(e => e.Id == id);

                if (product.Completion == "GOODS")
                {
                    foreach (VisioMap visiomap in product.VisioMaps.Reverse())
                    {
                        foreach (Shape shape in visiomap.Shapes.Reverse())
                        {
                            foreach (RelationShape reShape in shape.RelationShapes.Reverse())
                                db.Remove(reShape);

                            db.Remove(shape);
                        }

                        foreach (RelationVisiomap reVisiomap in visiomap.Relations.Reverse())
                            db.Remove(reVisiomap);

                        db.Remove(visiomap);
                    }

                    foreach (var wdmap in product.WordMaps.Reverse())
                        db.Remove(wdmap);

                    foreach (Variant variant in product.Children.Reverse())
                        db.Remove(variant);
                }
                else
                {
                    IEnumerable<Variant> variants = db.Variants.Where(e => e.ProductId == product.Id);

                    foreach (Variant variant in variants.Reverse())
                    {
                        var reVisios = db.RelationVisiomaps.Where(e => e.VariantIds.Contains(variant.Id.ToString()));

                        foreach (RelationVisiomap reVisio in reVisios.Reverse())
                        {
                            if (reVisio.VariantIds.Contains(','))
                            {
                                string[] oIds = reVisio.VariantIds.Split(',');
                                string nIds = null;

                                for (int i = 0; i < oIds.Length; i++)
                                {
                                    if (oIds[i] != variant.Id.ToString())
                                    {
                                        if (i == 0)
                                            nIds = oIds[i];
                                        else
                                            nIds += "," + oIds[i];
                                    }
                                }

                                reVisio.VariantIds = nIds;
                                db.Update(reVisio);
                            }
                            else
                            {
                                //VisioMap visiomap = reVisio.VisioMap;
                                VisioMap visiomap = await db.VisioMaps
                                    .Include(e => e.Shapes)
                                    .Include(e => e.Relations)
                                    .FirstOrDefaultAsync(e => e.Id == reVisio.VisiomapId);

                                foreach (Diagram diagram in db.Diagrams.Where(e => e.VisioMapId == visiomap.Id).Reverse())
                                    db.Remove(diagram);

                                foreach (Shape shape in visiomap.Shapes.Reverse())
                                    db.Remove(shape);

                                db.Remove(reVisio);

                                if (visiomap.Relations.Count() == 0)
                                    db.Remove(visiomap);
                            }
                        }
                        db.Remove(variant);
                    }
                }
                db.SaveChanges();


                Log log = new Log
                {
                    RefId = id,
                    DataType = "Product",
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ActionType = "DeleteProduct"
                };
                db.Add(log);

                // Product 삭제
                db.Remove(product);
                db.SaveChanges();
            }
            return "Success";
        }

        // Copy
        public async void CopyProducts(string json)
        {
            foreach (int productId in JArray.Parse(json))
            {
                // Product
                Product oProduct = await db.Products
                    .Include(e => e.Children)
                    .FirstOrDefaultAsync(e => e.Id == productId);

                Product nProduct = new Product();
                nProduct = (Product)db.Entry(oProduct).GetDatabaseValues().ToObject();

                db.Add(nProduct);
                db.SaveChanges();

                JObject obProduct = new JObject();
                obProduct.Add("Model", nProduct.Model);
                obProduct.Add("Title", nProduct.Title);
                obProduct.Add("Completion", nProduct.Completion);
                obProduct.Add("EquipmentId", nProduct.EquipmentId);
                obProduct.Add("Mass", nProduct.Mass);
                obProduct.Add("componentIdx", nProduct.ComponentIdx);
                obProduct.Add("State", nProduct.State);
                obProduct.Add("Group", nProduct.Group);
                obProduct.Add("TableCol", nProduct.TableCol);

                Log log = new Log
                {
                    RefId = nProduct.Id,
                    DataType = "Product",
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ChangeData = obProduct.ToString(),
                    ActionType = "CopyProduct"
                };

                db.Add(log);
                db.SaveChanges();

                // Variants
                foreach (Variant oVariant in oProduct.Children)
                {
                    Variant nVariant = new Variant();
                    nVariant = (Variant)db.Entry(oVariant).GetDatabaseValues().ToObject();

                    nProduct.Children.Add(nVariant);
                    db.SaveChanges();

                    JObject obVariant = new JObject();
                    obVariant.Add("ComponentName", nVariant.ComponentName);
                    obVariant.Add("ProductId", nVariant.ProductId);
                    obVariant.Add("Default", nVariant.Default);
                    obVariant.Add("Priority", nVariant.Priority);
                    obVariant.Add("Remark", nVariant.Remark);
                    obVariant.Add("Quantity", nVariant.Quantity);
                    obVariant.Add("Unit", nVariant.Unit);
                    obVariant.Add("Mass", nVariant.Mass);
                    obVariant.Add("ParentId", nVariant.ParentId);
                    obVariant.Add("VariantGroup", nVariant.VariantGroup);

                    Log logVariant = new Log
                    {
                        RefId = nVariant.Id,
                        DataType = "Variant",
                        Date = DateTime.Now,
                        User = User.Identity.Name,
                        ChangeData = obVariant.ToString(),
                        ActionType = "CopyProduct"
                    };
                    db.Add(logVariant);
                    db.SaveChanges();
                }
            }
        }
        #endregion


        #region [Component]
        [Route("products/{id}/edit")]       // GET: Products/Edit/5
        public async Task<IActionResult> Edit(int? id, string returnUrl)
        {
            if (id == null)
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);

            //Product product = db.Product.Find(id);
            Product product = await db.Products
                .Include(e => e.Equipment)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);

            ViewBag.ComponentIdx = new SelectList(db2.XComponents.Where(e => e.IsProduct == 1), "ComponentIdx", "Model", product.ComponentIdx);
            ViewBag.ReturnUrl = returnUrl;
            ViewBag.State = new SelectList(db.State, product.State);

            return View(product);
        }
        public void SaveProduct(int productId, string name, string value)
        {
            Product product = db.Products.Find(productId);
            JObject obProduct = new JObject();

            switch (name)
            {
                case "Model":
                    product.Model = value;
                    obProduct.Add("Model", product.Model);
                    break;
                case "Group":
                    product.Group = value;
                    obProduct.Add("Group", product.Group);
                    break;
                case "Mass":
                    product.Mass = value;
                    obProduct.Add("Mass", product.Mass);
                    break;
                case "componentIdx":
                    product.ComponentIdx = int.Parse(value);
                    obProduct.Add("ComponentIdx", product.ComponentIdx);
                    break;
                case "State":
                    product.State = int.Parse(value);
                    obProduct.Add("State", product.State);
                    break;
            }
            db.Update(product);


            Log log = new Log
            {
                RefId = productId,
                DataType = "Product",
                Date = DateTime.Now,
                User = User.Identity.Name,
                ChangeData = obProduct.ToString(),
                ActionType = "EditProduct"
            };
            db.Add(log);
            db.SaveChanges();
        }
        public JObject LoadManual(int? id)
        {
            JObject obManual = new JObject();


            // Product id 있는 지 확인
            if (id == null)
            {
                obManual.Add("result", "id 값이 null입니다.");
                return obManual;
            }

            Product product = db.Products.Find(id);
            IEnumerable<XAppComponent> xAppComponents = db2.XAppComponents.Where(e => e.AppCategory == "LIB" && e.ComponentIdx == product.ComponentIdx);


            JArray arrFile = new JArray();

            foreach (XAppComponent xAppComponent in xAppComponents)
            {
                var xLibraries = db2.XLibraries.Where(e => e.LibIdx == xAppComponent.AppIdx);

                if (xLibraries.Count() == 0)
                    continue;

                XLibrary xlib = xLibraries.First();


                var xResource = db2.XResources.Where(e => e.AppIdx == xlib.LibIdx && e.AppCategory == "LIB" && e.IsUrl == 0 && e.FileCategory == "MNL"
                    && e.SubCategory == "IST");
                //  X_Resource의 subCategory에 "IST"가 들어가있지 않으면 못불러옴 (ERP2에서 수정해야 함)

                if (xResource.Count() == 0)
                    continue;

                XResource xRes = xResource.First();


                var xFileRepoes = db2.XFileRepositories.Where(e => e.AppIdx == xRes.ResIdx && e.AppCategory == "RES");

                if (xFileRepoes.Count() == 0)
                    continue;

                XFileRepository xFileRepo = xFileRepoes.First();


                var xFiles = db2.XFiles.Where(e => e.FileIdx == xFileRepo.FileIdx);

                if (xFiles.Count() == 0)
                    continue;

                XFile xFile = xFiles.First();


                JObject obFile = new JObject();

                obFile.Add("AppIdx", xAppComponent.AppIdx);
                obFile.Add("FileName", xFile.FileName);
                obFile.Add("Code", xRes.Code);
                obFile.Add("Date", xRes.MDate);
                obFile.Add("Edition", xRes.FileVersion);
                obFile.Add("ChangeDate", string.Format("{0:yyyy/MM/dd HH:mm:ss}", xRes.EDate));
                obFile.Add("ChangeUser", xRes.EUser);


                arrFile.Add(obFile);
            }

            obManual.Add("Manuals", arrFile);
            obManual.Add("Result", "Success");

            return obManual;
        }

        #region Components list
        public async Task<JArray> LoadComponent(int id)
        {
            // 최상위
            JArray arrJson = new JArray();

            // components list
            Product product = await db.Products
                .Include(e => e.Children)
                    .ThenInclude(c => c.Code)
                .Include(e => e.Children)
                    .ThenInclude(e => e.Product)
                .AsNoTracking().FirstOrDefaultAsync(m => m.Id == id);

            var groups = product.Children.GroupBy(e => e.VariantGroup);

            foreach (var group in groups)
            {
                Variant first = group.First();

                // components
                JObject obGroup = new JObject();
                arrJson.Add(obGroup);

                obGroup.Add("Id", first.VariantGroup);
                obGroup.Add("Name", first.Code.Name);

                JArray arrVariant = new JArray();
                obGroup.Add("Variants", arrVariant);

                foreach (Variant variant in group.OrderBy(e => e.Priority))
                {
                    //variant.Product = await db.Product.FindAsync(variant.ProductId);

                    JObject obVariant = new JObject();
                    arrVariant.Add(obVariant);

                    obVariant.Add("Id", variant.Id);
                    obVariant.Add("Default", variant.Default);
                    obVariant.Add("Priority", variant.Priority);
                    obVariant.Add("ProductModel", variant.Product.Model);
                    obVariant.Add("VariantName", variant.ComponentName);
                    obVariant.Add("Qty", variant.Quantity);
                    obVariant.Add("Unit", variant.Unit);
                    obVariant.Add("Mass", variant.Mass);
                    obVariant.Add("Remark", variant.Remark);
                }
            }

            return arrJson;
        }
        public async Task<JObject> LoadEditModel(int variantId)
        {
            // Products list
            JArray arrProducts = new JArray();
            IEnumerable<Product> products = db.Products.Where(p => p.Completion.Contains("PARTS"));

            foreach (var product in products)
            {
                JObject item = new JObject();

                item.Add("Id", product.Id);
                item.Add("Model", product.Model);
                item.Add("Title", product.Title);

                arrProducts.Add(item);
            }

            // groups
            JArray arrGroup = new JArray();
            IEnumerable<Code> groups = db.Codes.Where(e => e.Type == "VG");

            foreach (Code group in groups)
            {
                JObject obGroup = new JObject();
                arrGroup.Add(obGroup);

                obGroup.Add("Id", group.Id);
                obGroup.Add("Name", group.Name);
            }

            // Select item
            Variant variant = await db.Variants
                .Include(e => e.Code)
                .AsTracking()
                .FirstOrDefaultAsync(e => e.Id == variantId);

            JObject selectItem = new JObject();
            selectItem.Add("Id", variantId);
            selectItem.Add("ComponentName", variant.ComponentName);
            selectItem.Add("ProductId", variant.ProductId);
            selectItem.Add("Group", variant.Code.Name);
            selectItem.Add("Def", variant.Default);
            selectItem.Add("Priority", variant.Priority);
            selectItem.Add("Quantity", variant.Quantity);
            selectItem.Add("Remark", variant.Remark);
            selectItem.Add("Unit", variant.Unit);
            selectItem.Add("Mass", variant.Mass);
            selectItem.Add("ParentId", variant.ParentId);
            selectItem.Add("VariantGroup", variant.VariantGroup);

            JObject pass = new JObject();
            pass.Add("ProductsList", arrProducts);
            pass.Add("GroupList", arrGroup);
            pass.Add("SelectItem", selectItem);

            return pass;
        }
        public void ChangePriority(int productId, string variantGroups)
        {
            JArray arrGroup = JArray.Parse(variantGroups);
            int p = 0;

            foreach (JObject group in arrGroup)
            {
                int groupId = (int)group["GroupId"];
                JArray arrComponent = (JArray)group["Components"];

                foreach (int variantId in arrComponent)
                {
                    Variant variant = db.Variants.Find(variantId);
                    p += 1;

                    if (variant.VariantGroup == groupId && variant.Priority == p)
                        continue;

                    JObject obVariant = new JObject();

                    if (variant.Priority != p)
                    {
                        variant.Priority = p;
                        obVariant.Add("Priority", variant.Priority);

                        if (variant.VariantGroup != groupId)
                        {
                            variant.VariantGroup = groupId;
                            obVariant.Add("Group", variant.VariantGroup);
                        }
                    }
                    db.Update(variant);

                    Log log = new Log
                    {
                        RefId = variant.Id,
                        DataType = "Variant",
                        Date = DateTime.Now,
                        User = User.Identity.Name,
                        ChangeData = obVariant.ToString(),
                        ActionType = "ChangePriority"
                    };
                    db.Add(log);
                }
            }
            db.SaveChanges();
        }
        public async void DeleteComponents(string json, int productId)
        {
            // delete variant
            JArray arrVariants = JArray.Parse(json);

            foreach (int variantId in arrVariants)
            {
                Variant variant = db.Variants.Find(variantId);

                IEnumerable<RelationVisiomap> relations = db.RelationVisiomaps.Where(e => e.VariantIds != null && e.VariantIds.Contains(variant.Id.ToString()));
                foreach (RelationVisiomap relation in relations.Reverse())
                {
                    List<string> arrVariantId = relation.VariantIds.Split(',').ToList();

                    for (int i = arrVariantId.Count; i >= 0; i--)
                    {
                        int id = int.Parse(arrVariantId[i]);

                        if (id == variant.Id)
                            arrVariantId.RemoveAt(i);
                    }

                    if (arrVariantId.Count == 0)
                    {
                        db.Remove(relation);
                    }
                    else
                    {
                        relation.VariantIds = string.Join(",", arrVariantId);
                        db.Update(relation);
                    }
                }
                relations = null;


                IEnumerable<WordMap> wordmaps = db.WordMaps.Where(e => e.VariantIds != null && e.VariantIds.Contains(variant.Id.ToString()));
                foreach (WordMap wordmap in wordmaps)
                {
                    List<string> arrVariantId = wordmap.VariantIds.Split(',').ToList();

                    for (int i = arrVariantId.Count; i >= 0; i--)
                    {
                        int id = int.Parse(arrVariantId[i]);

                        if (id == variant.Id)
                            arrVariantId.RemoveAt(i);
                    }

                    wordmap.VariantIds = string.Join(",", arrVariantId);
                    db.Update(wordmap);
                }


                Log log = new Log
                {
                    RefId = variantId,
                    DataType = "Variant",
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ActionType = "DeleteComponent"
                };
                db.Add(log);
                db.Remove(variant);
            }

            db.SaveChanges();


            // priority
            Product product = await db.Products
                .Include(e => e.Variants)
                .FirstOrDefaultAsync(e => e.Id == productId);
            int p = 0;

            foreach (Variant variant in product.Variants.OrderBy(e => e.Priority))
            {
                p += 1;

                if (variant.Priority != p)
                {
                    variant.Priority = p;

                    Log log = new Log
                    {
                        RefId = variant.Id,
                        DataType = "Variant",
                        Date = DateTime.Now,
                        User = User.Identity.Name,
                        ActionType = "DeleteComponent"
                    };
                    db.Add(log);
                    db.Update(variant);
                }
            }

            db.SaveChanges();
        }

        public void SubmitEditPart(int id, int? def, int? variantGroup, string componentName, int? productId, int? quantity, string unit, string mass, string remark)
        {
            JObject obVariant = new JObject();

            Variant variant = db.Variants.Find(id);
            bool change = false;

            if (variant.Default != def)
            {
                variant.Default = def;
                obVariant.Add("Default", variant.Default);
                change = true;
            }

            if (variant.VariantGroup != variantGroup)
            {
                variant.VariantGroup = variantGroup;
                obVariant.Add("VariantGroup", variant.VariantGroup);
                change = true;
            }

            if (variant.ComponentName != componentName)
            {
                variant.ComponentName = componentName;
                obVariant.Add("ComponentName", variant.ComponentName);
                change = true;
            }

            if (variant.ProductId != productId)
            {
                variant.ProductId = productId;
                obVariant.Add("ProductId", variant.ProductId);
                change = true;
            }

            if (variant.Quantity != quantity)
            {
                variant.Quantity = quantity;
                obVariant.Add("Quantity", variant.Quantity);
                change = true;
            }

            if (variant.Unit != unit)
            {
                variant.Unit = unit;
                obVariant.Add("Unit", variant.Unit);
                change = true;
            }

            if (variant.Mass != mass)
            {
                variant.Mass = string.IsNullOrEmpty(variant.Mass) ? null : variant.Mass;
                mass = string.IsNullOrEmpty(mass) ? null : mass;

                if (variant.Mass != mass)
                {
                    variant.Mass = mass;
                    obVariant.Add("Mass", variant.Mass);
                    change = true;
                }
            }

            if (variant.Remark != remark)
            {
                variant.Remark = string.IsNullOrEmpty(variant.Remark) ? null : variant.Remark;
                remark = string.IsNullOrEmpty(remark) ? null : remark;

                if (variant.Remark != remark)
                {
                    variant.Remark = remark;
                    obVariant.Add("Remark", variant.Remark);
                    change = true;
                }
            }

            if (change)
            {
                Log log = new Log
                {
                    RefId = variant.Id,
                    DataType = "Variant",
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ChangeData = obVariant.ToString(),
                    ActionType = "EditVariant"
                };
                db.Add(log);
                db.Update(variant);
                db.SaveChanges();
            }
        }
        #endregion


        #region Add parts list
        public JArray SearchPart(string strFilter)
        {
            JArray arrJson = new JArray();
            IEnumerable<Product> products = db.Products.Where(e => e.Completion == "PARTS" && e.Model.Contains(strFilter));

            if (string.IsNullOrEmpty(strFilter))
            {
                int x = products.Count() - 30;
                products = products.OrderBy(e => e.Id).Skip(x);
            }


            foreach (var product in products)
            {
                JObject obProduct = new JObject();
                arrJson.Add(obProduct);

                obProduct.Add("Id", product.Id);
                obProduct.Add("Model", product.Model);
                obProduct.Add("Name", product.Title);
            }

            return arrJson;
        }
        public async void SaveComponent(string json)
        {
            JObject root = JObject.Parse(json);

            int mainId = (int)root["MainId"];
            JArray arrComp = (JArray)root["Component"];

            // GOODS product
            Product product = await db.Products
                .Include(e => e.Children)
                .FirstOrDefaultAsync(e => e.Id == mainId);

            int last = product.Children.Count() == 0 ? 0 : (int)product.Children.OrderBy(p => p.Priority).Last().Priority;

            // PARTS product
            foreach (var item in root["Component"].Reverse())
            {
                last += 1;

                int productId = (int)item["Id"];
                Product part = db.Products.Find(productId);

                int group = (int)item["Group"];

                Variant variant = new Variant
                {
                    ComponentName = part.Title,
                    ProductId = productId,
                    Default = null,
                    Priority = last,
                    Quantity = 1,
                    Unit = "Count",
                    Mass = part.Mass,
                    ParentId = mainId,
                    VariantGroup = group
                };

                product.Children.Add(variant);
                db.SaveChanges();

                JObject obVariant = new JObject();
                obVariant.Add("ComponentName", variant.ComponentName);
                obVariant.Add("ProductId", variant.ProductId);
                obVariant.Add("Default", variant.Default);
                obVariant.Add("Priority", variant.Priority);
                obVariant.Add("Quantity", variant.Quantity);
                obVariant.Add("Unit", variant.Unit);
                obVariant.Add("Mass", variant.Mass);
                obVariant.Add("ParentId", variant.ParentId);
                obVariant.Add("VariantGroup", variant.VariantGroup);

                Log log = new Log
                {
                    RefId = variant.Id,
                    DataType = "Variant",
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ChangeData = obVariant.ToString(),
                    ActionType = "AddComponent"
                };
                db.Add(log);
                db.SaveChanges();
            }
        }
        public void NewPart(string model, string desc, string mass)
        {
            Product product = new Product
            {
                Model = model,
                Title = desc,
                Completion = "PARTS",
                EquipmentId = 7,
                Mass = mass
            };
            db.Add(product);
            db.SaveChanges();

            JObject obProduct = new JObject();
            obProduct.Add("Model", product.Model);
            obProduct.Add("Title", product.Title);
            obProduct.Add("Completion", product.Completion);
            obProduct.Add("EquipmentId", product.EquipmentId);
            obProduct.Add("Mass", product.Mass);

            Log log = new Log
            {
                RefId = product.Id,
                DataType = "Product",
                Date = DateTime.Now,
                User = User.Identity.Name,
                ChangeData = obProduct.ToString(),
                ActionType = "CreateProduct"
            };
            db.Add(log);
            db.SaveChanges();
        }
        #endregion


        #region Variant group list
        public JArray LoadVariantGroup()
        {
            JArray arrJson = new JArray();

            IEnumerable<Code> groups = db.Codes.Where(e => e.Type == "VG");

            foreach (Code group in groups)
            {
                JObject obGroup = new JObject();
                arrJson.Add(obGroup);

                obGroup.Add("Id", group.Id);
                obGroup.Add("Name", group.Name);
            }

            return arrJson;
        }
        public void AddVariantGroup(string groupName)
        {
            Code vGroup = new Code
            {
                Type = "VG",
                Name = groupName
            };

            db.Add(vGroup);
            db.SaveChanges();

            JObject obGroup = new JObject();
            obGroup.Add("Type", vGroup.Type);
            obGroup.Add("Name", vGroup.Name);

            Log log = new Log
            {
                RefId = vGroup.Id,
                DataType = "Code",
                Date = DateTime.Now,
                User = User.Identity.Name,
                ChangeData = obGroup.ToString()
            };

            db.Add(log);
            db.SaveChanges();
        }
        public void RemoveVariantGroup(int id)
        {
            Code vGroup = db.Codes.Find(id);

            db.Remove(vGroup);
            db.SaveChanges();
        }
        #endregion


        //public JObject LoadEditManual(int? id)
        //{
        //    JObject obManual = new JObject();

        //    if (id == null)
        //    {
        //        obManual.Add("Result", "Id를 찾을 수 없습니다.");
        //        return obManual;
        //    }

        //    Manual manual = db.Manuals.Find(id);
        //    obManual.Add("FileName", manual.FileName);
        //    obManual.Add("Code", manual.Code);
        //    obManual.Add("Date", manual.Date);
        //    obManual.Add("Edition", manual.Edition);

        //    obManual.Add("Result", "Success");

        //    return obManual;
        //}

        //[HttpPost]
        //public string EditManual(int? id, string code, string date, string edition)
        //{
        //    if (id == null)
        //        return "Edit id가 전달되지 않습니다.";

        //    Manual manual = db.Manuals.Find(id);
        //    manual.Code = code.Trim();
        //    manual.Date = date.Trim();
        //    manual.Edition = edition.Trim();
        //    manual.ChangeDate = DateTime.Now;

        //    db.Entry(manual).State = EntityState.Modified;
        //    db.SaveChanges();

        //    if (Request.Files.Count > 0)
        //    {
        //        try
        //        {
        //            HttpFileCollectionBase files = Request.Files;

        //            for (int i = 0; i < files.Count; i++)
        //            {
        //                HttpPostedFileBase file = files[i];
        //                string fname;

        //                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
        //                {
        //                    string[] testfiles = file.FileName.Split(new char[] { '\\' });
        //                    fname = testfiles[testfiles.Length - 1];
        //                }
        //                else
        //                    fname = file.FileName;


        //                // 기존 파일 삭제
        //                string oPath = string.Format(@"{0}\{1}\{2}", HttpContext.Server.MapPath("~/template"), manual.product.Model, manual.FileName);

        //                System.IO.FileInfo fi = new System.IO.FileInfo(oPath);
        //                if (fi.Exists)
        //                    fi.Delete();


        //                // 새 파일 저장
        //                string nPath = string.Format(@"{0}\{1}\{2}", HttpContext.Server.MapPath("~/template"), manual.product.Model, fname);
        //                fi = new System.IO.FileInfo(nPath);

        //                if (fi.Exists)
        //                    return "저장된 파일이 있습니다.";
        //                else
        //                {
        //                    file.SaveAs(nPath);

        //                    manual.FileName = fname;
        //                    db.Entry(manual).State = EntityState.Modified;
        //                    db.SaveChanges();
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            return "Error occurred. Error details: " + ex.Message;
        //        }
        //    }

        //    return "Success";
        //}

        //[HttpPost]
        //public string AddManual(int id, string code, string date, string edition)
        //{
        //    if (Request.Files.Count > 0)
        //    {
        //        try
        //        {
        //            HttpFileCollectionBase files = Request.Files;

        //            for (int i = 0; i < files.Count; i++)
        //            {
        //                HttpPostedFileBase file = files[i];
        //                string fname;

        //                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
        //                {
        //                    string[] testfiles = file.FileName.Split(new char[] { '\\' });
        //                    fname = testfiles[testfiles.Length - 1];
        //                }
        //                else
        //                    fname = file.FileName;

        //                var products = db.Products.Where(e => e.Id == id);


        //                if (products.Count() == 0)
        //                    return "Product에 문제가 있습니다.";
        //                else
        //                {
        //                    Product product = products.First();
        //                    string path = string.Format(@"{0}\{1}\{2}", HttpContext.Server.MapPath("~/template"), product.Model, fname);

        //                    System.IO.FileInfo fi = new System.IO.FileInfo(path);

        //                    if (fi.Exists)
        //                        return "저장된 파일이 있습니다.";
        //                    else
        //                    {
        //                        file.SaveAs(path);

        //                        if (db.Manuals.Where(e => e.FileName == fname).Count() > 0)
        //                            return "등록된 DB가 존재합니다.";
        //                        else
        //                        {
        //                            Manual manual = new Manual
        //                            {
        //                                ProductId = product.Id,
        //                                FileName = fname,
        //                                Code = code,
        //                                Date = date,
        //                                Edition = edition,
        //                                ChangeDate = System.DateTime.Now
        //                            };

        //                            db.Manuals.Add(manual);
        //                            db.SaveChanges();
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            return "Error occurred. Error details: " + ex.Message;
        //        }
        //    }

        //    return "Success";
        //}

        //public string DeleteManual(string json)
        //{
        //    if (json == null)
        //        return "Id가 없습니다.";

        //    JArray arrManual = JArray.Parse(json);

        //    // file 확인
        //    foreach(int id in arrManual)
        //    {
        //        Manual manual = db.Manuals.Find(id);
        //        string fname = string.Format(@"{0}\{1}\{2}", HttpContext.Server.MapPath("~/template"), manual.product.Model, manual.FileName);

        //        System.IO.FileInfo fi = new System.IO.FileInfo(fname);
        //        if (fi.Exists)
        //            fi.Delete();

        //        db.Manuals.Remove(manual);
        //        db.SaveChanges();
        //    }
        //    return "Success";
        //}

        #endregion

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
                db2.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
