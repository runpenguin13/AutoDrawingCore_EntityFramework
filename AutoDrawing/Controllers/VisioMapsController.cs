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

namespace AutoDrawing.Controllers
{
    public class VisioMapsController : Controller
    {
        private readonly DrawingDemoContext db;
        private readonly KJERPXContext db2;

        public VisioMapsController(DrawingDemoContext context, KJERPXContext context2)
        {
            db = context;
            db2 = context2;
        }

        // GET: VisioMaps
        public IActionResult Index()
        {
            return View();
        }



        #region List page
        public JObject LoadItem(int? equipId, int? proId)
        {
            JObject obList = new JObject();

            if (equipId == null)
            {
                // Load
                JArray arrEquip = new JArray();

                var equipments = db.Equipments.Where(e => e.Group != null);

                foreach (var equipment in equipments)
                {
                    JObject obEquip = new JObject();

                    obEquip.Add("EquipmentId", equipment.Id);
                    obEquip.Add("EquipmentName", equipment.Name);

                    arrEquip.Add(obEquip);
                }

                obList.Add("Equipments", arrEquip);
            }
            else
            {
                if (proId == null)
                {
                    // Equipment change
                    JArray arrPro = new JArray();

                    var products = db.Products.Where(e => e.EquipmentId == equipId);

                    foreach (var product in products)
                    {
                        JObject obProduct = new JObject();

                        obProduct.Add("ProductId", product.Id);
                        obProduct.Add("ProductModel", product.Model);

                        arrPro.Add(obProduct);
                    }

                    obList.Add("Products", arrPro);
                }
                else
                {
                    // Product change
                    JArray arrFile = new JArray();

                    var files = db.WordMaps.Where(e => e.ProductId == proId && e.ElementType == "VISIO");

                    foreach (var file in files)
                    {
                        if (file.Object == null)
                            continue;

                        JObject obFile = new JObject();
                        arrFile.Add(obFile);

                        obFile.Add("WordMapId", file.Id);
                        obFile.Add("FileName", file.Object);
                    }

                    obList.Add("Files", arrFile);
                }
            }

            return obList;
        }
        #endregion


        #region Load item
        public async Task<JObject> LoadVisioMapItem(int? visioId)
        {
            JObject json = new JObject();

            VisioMap visiomap = await db.VisioMaps
                .Include(e => e.Product)
                    .ThenInclude(e => e.Equipment)
                .Include(e => e.Shapes)
                    .ThenInclude(e => e.RelationShapes)
                .Include(e => e.Relations)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == visioId);


            #region Information
            JObject info = new JObject();
            json.Add("ItemInfo", info);

            info.Add("Id", visioId);
            info.Add("ProductNumber", visiomap.Product.Model);
            info.Add("ProductId", visiomap.Product.Id);

            info.Add("EquipmentId", visiomap.Product.EquipmentId);
            info.Add("EquipmentGroup", visiomap.Product.Equipment.Group);

            info.Add("WordMapId", visiomap.WordMapId);
            info.Add("Group", visiomap.Group);
            info.Add("Title", visiomap.Title);
            info.Add("Default", visiomap.Default);
            info.Add("EnableLayer", visiomap.EnableLayer);
            #endregion


            #region Shapes
            JArray arrShape = new JArray();
            json.Add("Shapes", arrShape);

            foreach (Shape shape in visiomap.Shapes)
            {
                JObject obShape = new JObject();
                arrShape.Add(obShape);

                obShape.Add("VisioMapId", shape.Id);
                obShape.Add("Type", shape.Type);
                obShape.Add("Name", shape.Name);
                obShape.Add("Text", shape.Text);

                JArray arrReShape = new JArray();
                obShape.Add("ReShape", arrReShape);


                if (shape.RelationShapes.Count() > 0)
                {
                    foreach (RelationShape reShape in shape.RelationShapes)
                    {
                        JObject obReShape = new JObject();
                        arrReShape.Add(obReShape);

                        obReShape.Add("ReShapeId", reShape.Id);
                        obReShape.Add("ReProduct", reShape.ReShape.VisioMap.ProductId);
                        obReShape.Add("ReLayer", reShape.ReShape.VisioMapId);
                        obReShape.Add("ReShape", reShape.ReShapeId);
                        obReShape.Add("Method", reShape.Method);
                        obReShape.Add("Value", reShape.Value);
                    }
                }
            }
            #endregion


            #region Relations
            JArray arrRelation = new JArray();
            json.Add("Relations", arrRelation);

            foreach (RelationVisiomap relation in visiomap.Relations)
            {
                arrRelation.Add(relation.Id);
                //JObject obRelation = new JObject();
                //arrRelation.Add(obRelation);

                //obRelation.Add("Id", relation.Id);
                //obRelation.Add("VisiomapId", relation.VisiomapId);
                //obRelation.Add("RelationType", relation.RelationType);
                //obRelation.Add("Method", relation.Method);

                //obRelation.Add("IntEquipmentId", relation.IntEquipmentId);
                //obRelation.Add("IntProductId", relation.IntProductId);
                //obRelation.Add("ReLayerId", relation.ReLayerId);
            }
            #endregion

            return json;
        }

        public JArray EquipmentList()
        {
            JArray arrEquipments = new JArray();

            foreach (Equipment equipment in db.Equipments.ToList())
            {
                JObject obEquipment = new JObject();
                arrEquipments.Add(obEquipment);

                obEquipment.Add("Id", equipment.Id);
                obEquipment.Add("Name", equipment.Name);
            }

            return arrEquipments;
        }

        public JArray ProductList(int? equipmentId)
        {
            JArray arrProducts = new JArray();

            var products = db.Products.Where(e => e.EquipmentId == equipmentId);

            foreach (Product product in products)
            {
                JObject obProduct = new JObject();
                arrProducts.Add(obProduct);

                obProduct.Add("Id", product.Id);
                obProduct.Add("Model", product.Model);
            }

            return arrProducts;
        }

        public JArray FileList(int? productId)
        {
            JArray arrFiles = new JArray();

            var wordmaps = db.WordMaps.Where(e => e.ProductId == productId && e.ElementType == "VISIO");

            foreach (WordMap wordmap in wordmaps)
            {
                JObject obFile = new JObject();
                arrFiles.Add(obFile);

                obFile.Add("Id", wordmap.Id);
                obFile.Add("FileName", wordmap.Object);
            }

            return arrFiles;
        }

        public JArray ComponentList(int? productId)
        {
            JArray arrComponent = new JArray();

            if (productId != null)
            {
                var components = db.Variants
                    .Include(e => e.Code)
                    .Include(e => e.Product)
                    .Where(e => e.ParentId == productId);

                foreach (Variant component in components)
                {
                    JObject obComponent = new JObject();
                    arrComponent.Add(obComponent);

                    obComponent.Add("Id", component.Id);
                    obComponent.Add("Name", component.ComponentName);
                    obComponent.Add("Model", component.Product.Model);
                    obComponent.Add("Group", component.Code.Name);
                    obComponent.Add("Remark", component.Remark);
                }
            }

            return arrComponent;
        }

        public async Task<JObject> LoadRelation(int? id)
        {
            JObject obRelation = new JObject();

            if (id != null)
            {
                RelationVisiomap relation = await db.RelationVisiomaps
                    .Include(e => e.VisioMap)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(e => e.Id == id);


                obRelation.Add("ProductId", relation.VisioMap.ProductId);
                obRelation.Add("Id", relation.Id);
                obRelation.Add("VisiomapId", relation.VisiomapId);
                obRelation.Add("Method", relation.Method);
                obRelation.Add("IntEquipmentId", relation.IntEquipmentId);
                obRelation.Add("IntProductId", relation.IntProductId);
                obRelation.Add("ReLayerId", relation.ReLayerId);
                obRelation.Add("ReLayerValue", string.IsNullOrEmpty(relation.ReLayerValue) ? "" : relation.ReLayerValue.Trim());
                obRelation.Add("Value", relation.Value);


                if (relation.VariantIds != null)
                {
                    JArray arrVariantIds = new JArray();
                    obRelation.Add("VariantIds", arrVariantIds);

                    string[] arrId = relation.VariantIds.Split(',');

                    foreach (string strId in arrId)
                    {
                        int intId = int.Parse(strId);
                        arrVariantIds.Add(intId);
                    }
                }
            }

            return obRelation;
        }

        public JArray LayerList(int? productId)
        {
            JArray arrLayer = new JArray();

            if (productId != null)
            {
                var layers = db.VisioMaps
                    .Include(e => e.WordMap)
                    .Where(e => e.ProductId == productId);

                foreach (VisioMap layer in layers)
                {
                    JObject obLayer = new JObject();
                    arrLayer.Add(obLayer);

                    obLayer.Add("Id", layer.Id);
                    obLayer.Add("Title", layer.Title);
                    obLayer.Add("Wordmap", layer.WordMap.Object);
                }
            }

            return arrLayer;
        }
        #endregion


        public async Task<JArray> LoadVisioMapList(int? equipId, int? goodsId, int? fileId)
        {
            JArray arrVisiomap = new JArray();

            IQueryable<VisioMap> visiomaps = db.VisioMaps
                .Include(e => e.WordMap)
                .Include(e => e.Product)
                    .ThenInclude(e => e.Equipment)
                .Include(e => e.Relations)
                .AsNoTracking();

            if (equipId != null)
                visiomaps = visiomaps.Where(e => e.Product.EquipmentId == equipId);

            if (goodsId != null)
                visiomaps = visiomaps.Where(e => e.ProductId == goodsId);

            if (fileId != null)
                visiomaps = visiomaps.Where(e => e.WordMapId == fileId);

            int countVisiomap = visiomaps.Count();
            int x = countVisiomap - 100;

            if (x > 0)
                visiomaps = visiomaps.OrderBy(e => e.Id).Skip(x);

            foreach (VisioMap visiomap in visiomaps)
            {
                JObject obVisiomap = new JObject();
                arrVisiomap.Add(obVisiomap);

                obVisiomap.Add("VsoId", visiomap.Id);
                obVisiomap.Add("EquipmentGroup", visiomap.Product.Equipment.Group);
                obVisiomap.Add("ProductNumber", visiomap.Product.Model);
                obVisiomap.Add("FileName", visiomap.WordMap.Object);

                var relations = visiomap.Relations.Where(e => e.VariantIds != null && !e.VariantIds.Contains(','));
                if (relations.Count() > 0)
                {
                    Variant variant = await db.Variants
                        .Include(e => e.Product)
                        .FirstOrDefaultAsync(e => e.Id == int.Parse(relations.First().VariantIds));
                    
                    obVisiomap.Add("VariantNumber", variant.Product.Model);
                }
                    

                obVisiomap.Add("Group", visiomap.Group);
                obVisiomap.Add("Title", visiomap.Title);
            }

            return arrVisiomap;
        }

        public JArray LoadVariantList(string strAction, int? id)
        {
            var groups = db.Variants
                .Include(e => e.Code)
                .Where(e => e.ParentId == id).GroupBy(e => e.VariantGroup);

            JArray variantsGroup = new JArray();

            foreach (var group in groups)
            {
                JArray arrVariant = new JArray();
                foreach (var variant in group.OrderBy(o => o.Priority))
                {
                    JObject item = new JObject();
                    arrVariant.Add(item);

                    Product product = db.Products.Find(variant.ProductId);
                    item.Add("VariantId", variant.Id);
                    item.Add("ProductModel", product.Model);
                    item.Add("VariantName", variant.ComponentName);
                }

                JObject objGroup = new JObject();
                variantsGroup.Add(objGroup);

                objGroup.Add("Group", group.First().Code.Name);
                objGroup.Add("Variants", arrVariant);
            }

            return variantsGroup;
        }

        public JObject LoadComponentName(int? variantId)
        {
            JObject objVariant = new JObject();

            string componentName = db.Variants.Find(variantId).ComponentName;
            objVariant.Add("Name", componentName);

            return objVariant;
        }

        public JObject LoadRelationData(int? productId, int? layerId)
        {
            JObject json = new JObject();


            // Products
            JArray arrProducts = new JArray();
            json.Add("Products", arrProducts);

            if (productId == null)
            {
                foreach (Product product in db.Products.Where(e => e.Completion == "GOODS"))
                {
                    JObject obProduct = new JObject();
                    arrProducts.Add(obProduct);

                    obProduct.Add("Id", product.Id);
                    obProduct.Add("Model", product.Model);
                }
            }


            // Layer
            JArray arrLayer = new JArray();
            json.Add("Layers", arrLayer);

            if (productId != null && layerId == null)
            {
                var visiomaps = db.VisioMaps
                    .Include(e => e.WordMap)
                    .Where(e => e.ProductId == productId);

                foreach (VisioMap visiomap in visiomaps)
                {
                    JObject obVisiomap = new JObject();
                    arrLayer.Add(obVisiomap);

                    obVisiomap.Add("Id", visiomap.Id);
                    obVisiomap.Add("Name", visiomap.EnableLayer);
                    obVisiomap.Add("File", visiomap.WordMap.Object);
                }
            }

            // Shapes
            JArray arrShape = new JArray();
            json.Add("Shapes", arrShape);

            if (productId != null && layerId != null)
            {
                var shapes = db.Shapes.Where(e => e.VisioMapId == layerId);

                foreach (Shape shape in shapes)
                {
                    JObject obShape = new JObject();
                    arrShape.Add(obShape);

                    obShape.Add("Id", shape.Id);
                    obShape.Add("Name", shape.Name);
                }
            }

            return json;
        }

        public void Create(VisioMap visiomap, string strRelations, string strShapes)
        {
            visiomap.Group = string.IsNullOrEmpty(visiomap.Group) ? null : visiomap.Group.Trim();
            visiomap.Title = string.IsNullOrEmpty(visiomap.Title) ? null : visiomap.Title.Trim();
            visiomap.Default = string.IsNullOrEmpty(visiomap.Default) || visiomap.Group != "INTERFACE" ? null : visiomap.Default.Trim();
            visiomap.EnableLayer = string.IsNullOrEmpty(visiomap.EnableLayer) ? null : visiomap.EnableLayer.Trim();
            visiomap.Date = DateTime.Now;
            visiomap.User = User.Identity.Name;

            db.Add(visiomap);


            #region Shapes
            if (!string.IsNullOrEmpty(strShapes))
            {
                foreach (string strShape in JArray.Parse(strShapes))
                {
                    string[] arrVal = strShape.Split(',');
                    string type = arrVal[0];
                    string name = arrVal[1];
                    string text = arrVal[2];
                    string reShape = arrVal[3];


                    Shape shape = new Shape
                    {
                        VisioMapId = visiomap.Id,
                        Type = string.IsNullOrEmpty(type) ? null : type,
                        Name = string.IsNullOrEmpty(name) ? null : name,
                        Text = string.IsNullOrEmpty(text) ? null : text,
                        Date = DateTime.Now,
                        User = User.Identity.Name
                    };

                    visiomap.Shapes.Add(shape);
                    db.SaveChanges();


                    if (!string.IsNullOrEmpty(reShape))
                    {
                        RelationShape newReShape = new RelationShape
                        {
                            ShapeId = shape.Id,
                            ReShapeId = int.Parse(reShape)
                        };

                        shape.RelationShapes.Add(newReShape);
                    }
                }

                db.SaveChanges();
            }
            #endregion


            #region Relation
            if (!string.IsNullOrEmpty(strRelations))
            {
                foreach (var strRelation in JArray.Parse(strRelations))
                {
                    string method = (string)strRelation["Method"];
                    string value = (string)strRelation["Value"];
                    string variantIds = (string)strRelation["VariantIds"];
                    int? intEquipmentId = (int?)strRelation["IntEquipmentId"];
                    int? intProductId = (int?)strRelation["IntProductId"];
                    int? reLayerId = (int?)strRelation["ReLayerId"];
                    string reLayerValue = (string)strRelation["ReLayerValue"];

                    RelationVisiomap relation = new RelationVisiomap
                    {
                        VisiomapId = visiomap.Id,
                        Method = string.IsNullOrEmpty(method) ? null : method.Trim(),
                        Value = string.IsNullOrEmpty(value) ? null : value.Trim(),
                        VariantIds = string.IsNullOrEmpty(variantIds) ? null : value.Trim(),
                        IntEquipmentId = intEquipmentId,
                        IntProductId = intProductId,
                        ReLayerId = reLayerId,
                        ReLayerValue = string.IsNullOrEmpty(reLayerValue) ? null : reLayerValue.Trim()
                    };
                    db.RelationVisiomaps.Add(relation);
                }

                db.SaveChanges();
            }
            #endregion
        }

        public async Task<string> Delete(string json)
        {
            foreach (int vsoId in JArray.Parse(json))
            {
                VisioMap visiomap = await db.VisioMaps
                    .Include(e => e.Diagrams)
                        .ThenInclude(e => e.Notations)
                    .Include(e => e.Shapes)
                    .Include(e => e.Relations)
                    .FirstOrDefaultAsync(e => e.Id == vsoId);


                // Diagram에 있는 지 확인
                if (visiomap.Diagrams.Count() > 0)
                {
                    foreach (Diagram diagram in visiomap.Diagrams.Reverse())
                    {
                        foreach (Diagram notation in diagram.Notations.Reverse())
                            db.Remove(notation);

                        db.Remove(diagram);
                    }
                }

                // Visiomap 하위 Shape 삭제
                foreach (Shape shape in visiomap.Shapes.Reverse())
                    db.Remove(shape);

                foreach (RelationVisiomap relation in visiomap.Relations.Reverse())
                    db.Remove(relation);


                // log
                Log log = new Log
                {
                    ActionType = "Delete",
                    DataType = "VisioMap",
                    RefId = visiomap.Id,
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ChangeData = new JObject { { "EnableLayer", visiomap.EnableLayer } }.ToString()
                };

                db.Add(log);
                db.Remove(visiomap);
            }

            db.SaveChanges();

            return "Success";
        }

        public void Edit(int id, int productId, string group, string title, string def, string enableLayer, int wordmapId, string strRelations)
        {
            VisioMap visiomap = db.VisioMaps.Find(id);
            bool change = false;

            JObject objJson = new JObject();

            JArray arrVisio = new JArray();
            objJson.Add("VisioMap", arrVisio);

            if (visiomap.ProductId != productId)
            {
                JObject obj = new JObject();
                obj.Add("Type", "ProductId");
                obj.Add("oValue", visiomap.ProductId);
                obj.Add("nValue", productId);
                arrVisio.Add(obj);

                visiomap.ProductId = productId;
                change = true;
            }
            if (visiomap.Group != (group = string.IsNullOrEmpty(group) ? null : group.Trim()))
            {
                JObject obj = new JObject();
                obj.Add("Type", "Group");
                obj.Add("oValue", visiomap.Group);
                obj.Add("nValue", group);
                arrVisio.Add(obj);

                visiomap.Group = group;
                change = true;
            }
            if (visiomap.Title != (title = string.IsNullOrEmpty(title) ? null : title.Trim()))
            {
                JObject obj = new JObject();
                obj.Add("Type", "Title");
                obj.Add("oValue", visiomap.Title);
                obj.Add("nValue", title);
                arrVisio.Add(obj);

                visiomap.Title = title;
                change = true;
            }
            if (visiomap.Default != (def = string.IsNullOrEmpty(def) ? null : def.Trim()))
            {
                JObject obj = new JObject();
                obj.Add("Type", "Default");
                obj.Add("oValue", visiomap.Default);
                obj.Add("nValue", def);
                arrVisio.Add(obj);

                visiomap.Default = def;
                change = true;
            }
            if (visiomap.EnableLayer != (enableLayer = string.IsNullOrEmpty(enableLayer) ? null : enableLayer.Trim()))
            {
                JObject obj = new JObject();
                obj.Add("Type", "EnableLayer");
                obj.Add("oValue", visiomap.EnableLayer);
                obj.Add("nValue", enableLayer);
                arrVisio.Add(obj);

                visiomap.EnableLayer = enableLayer;
                change = true;
            }
            if (visiomap.WordMapId != wordmapId)
            {
                JObject obj = new JObject();
                obj.Add("Type", "WordMapId");
                obj.Add("oValue", visiomap.WordMapId);
                obj.Add("nValue", wordmapId);
                arrVisio.Add(obj);

                visiomap.WordMapId = wordmapId;
                change = true;
            }

            db.Update(visiomap);
            db.SaveChanges();


            if (!string.IsNullOrEmpty(strRelations))
            {
                JObject ob = JObject.Parse(strRelations);

                JToken arrShape = ob["Shapes"];
                JToken arrRelation = ob["Relations"];


                #region Relation Layer
                foreach (JToken strRelation in arrRelation)
                {
                    string changeVal = (string)strRelation["ChangeVal"];
                    string method = (string)strRelation["Method"];
                    string value = (string)strRelation["Value"];
                    string gaVariant = (string)(strRelation["GAVariant"]);
                    string variantIds = (string)strRelation["VariantIds"];
                    int? intEquipmentId = (int?)strRelation["IntEquipmentId"];
                    int? intProductId = string.IsNullOrEmpty((string)strRelation["IntProductId"]) ? null : (int?)strRelation["IntProductId"];
                    int? reLayerId = string.IsNullOrEmpty((string)strRelation["ReLayerId"]) ? null : (int?)strRelation["ReLayerId"];
                    string reLayerValue = string.IsNullOrEmpty((string)strRelation["ReLayerValue"]) ? null : (string)strRelation["ReLayerValue"];


                    if (changeVal == "A")
                    {
                        RelationVisiomap relation = new RelationVisiomap
                        {
                            VisiomapId = visiomap.Id,
                            Method = method,
                            Value = value + (gaVariant == null ? "" : "," + gaVariant),
                            VariantIds = variantIds,
                            IntEquipmentId = intEquipmentId,
                            IntProductId = intProductId,
                            ReLayerId = reLayerId,
                            ReLayerValue = reLayerValue
                        };

                        db.Add(relation);
                    }
                    else if (changeVal == "D")
                    {
                        int? relationId = (int?)strRelation["RelationId"];
                        RelationVisiomap relation = db.RelationVisiomaps.Find(relationId);

                        db.Remove(relation);
                    }
                    else
                    {
                        int? relationId = (int?)strRelation["RelationId"];
                        RelationVisiomap relation = db.RelationVisiomaps.Find(relationId);

                        if (relation.Method != (method = string.IsNullOrEmpty(method) ? null : method.Trim()))
                            relation.Method = method;

                        if (relation.Value != (value = string.IsNullOrEmpty(value) ? null : value.Trim()))
                            relation.Value = value;

                        if (relation.VariantIds != (variantIds = string.IsNullOrEmpty(variantIds) ? null : variantIds.Trim()))
                            relation.VariantIds = variantIds;

                        if (relation.IntEquipmentId != intEquipmentId)
                            relation.IntEquipmentId = intEquipmentId;

                        if (relation.IntProductId != intProductId)
                            relation.IntProductId = intProductId;

                        if (relation.ReLayerId != reLayerId)
                            relation.ReLayerId = reLayerId;

                        if (relation.ReLayerValue != (reLayerValue = string.IsNullOrEmpty(reLayerValue) ? null : reLayerValue.Trim()))
                            relation.ReLayerValue = reLayerValue;

                        db.Update(relation);
                    }
                }
                #endregion


                #region Shape, Relation Shape
                JArray arrSha = new JArray();
                objJson.Add("Shape", arrSha);

                foreach (JToken strShape in arrShape)
                {
                    int? shapeId = string.IsNullOrEmpty((string)strShape["Id"]) ? null : (int?)strShape["Id"];
                    string changeVal = (string)strShape["ChangeVal"];
                    string type = (string)strShape["Type"];
                    string name = (string)strShape["Name"];
                    string text = (string)strShape["Text"];

                    JToken arrReShape = strShape["ReShapes"];
                    Shape shape = changeVal == "A" ? new Shape() : db.Shapes.Find(shapeId);


                    if (changeVal == "D")
                    {
                        // 지워야 하는 shape가 포함된 diagram 삭제
                        IEnumerable<Diagram> diagrams = db.Diagrams.Where(e => e.ShapeId == shape.Id);
                        foreach (Diagram diagram in diagrams.Reverse())
                            db.Remove(diagram);

                        JObject obj = new JObject();
                        obj.Add("Action", "Delete");
                        obj.Add("Id", shape.Id);
                        obj.Add("Name", shape.Name);
                        arrSha.Add(obj);

                        db.Remove(shape);
                    }
                    else if (changeVal == "A")
                    {
                        shape.VisioMapId = visiomap.Id;
                        shape.Type = string.IsNullOrEmpty(type) ? null : type.Trim();
                        shape.Name = string.IsNullOrEmpty(name) ? null : name.Trim();
                        shape.Text = string.IsNullOrEmpty(text) ? null : text.Trim();

                        shape.Date = DateTime.Now;
                        shape.User = User.Identity.Name;

                        db.Add(shape);
                    }
                    else
                    {
                        if (shape.Type != (type = string.IsNullOrEmpty(type) ? null : type.Trim()))
                        {
                            JObject obj = new JObject();
                            obj.Add("Type", "Type");
                            obj.Add("oValue", shape.Type);
                            obj.Add("nValue", type);
                            arrVisio.Add(obj);

                            shape.Type = type;
                            change = true;
                        }
                        if (shape.Name != (name = string.IsNullOrEmpty(name) ? null : name.Trim()))
                        {
                            JObject obj = new JObject();
                            obj.Add("Type", "Name");
                            obj.Add("oValue", shape.Name);
                            obj.Add("nValue", name);
                            arrVisio.Add(obj);

                            shape.Name = name;
                            change = true;
                        }
                        if (shape.Text != (text = string.IsNullOrEmpty(text) ? null : text.Trim()))
                        {
                            JObject obj = new JObject();
                            obj.Add("Type", "Text");
                            obj.Add("oValue", shape.Text);
                            obj.Add("nValue", text);
                            arrVisio.Add(obj);

                            shape.Text = text;
                            change = true;
                        }
                        db.Update(shape);
                    }

                    foreach (JToken strReShape in arrReShape)
                    {
                        string reChangeVal = (string)strReShape["ChangeVal"];
                        int reId = (int)strReShape["Id"];

                        int? reProductId = (int?)strReShape["ProductId"];
                        int? reLayerId = (int?)strReShape["LayerId"];
                        int? reShapeId = (int?)strReShape["ShapeId"];
                        string reMethod = (string)strReShape["Method"];
                        string reVal = (string)strReShape["Value"];

                        RelationShape reShape = reChangeVal == "A" ? new RelationShape() : db.RelationShapes.Find(reId);

                        if (reChangeVal == "D")
                            db.Remove(reShape);

                        else if (reChangeVal == "A")
                        {
                            reShape.ShapeId = shape.Id;
                            reShape.ReShapeId = reShapeId;
                            reShape.Method = string.IsNullOrEmpty(reMethod) ? null : reMethod.Trim();
                            reShape.Value = string.IsNullOrEmpty(reVal) ? null : reVal.Trim();

                            db.Add(reShape);
                        }
                        else
                        {
                            if (reShape.ShapeId != shapeId)
                                reShape.ShapeId = shapeId;

                            if (reShape.ReShapeId != reShapeId)
                                reShape.ReShapeId = reShapeId;

                            if (reShape.Method != (reMethod = string.IsNullOrEmpty(reMethod) ? null : reMethod.Trim()))
                                reShape.Method = reMethod;

                            if (reShape.Value != (reVal = string.IsNullOrEmpty(reVal) ? null : reVal.Trim()))
                                reShape.Value = reVal;

                            db.Update(reShape);
                        }
                    }
                }
                #endregion
            }

            if (change)
            {
                Log log = new Log
                {
                    ActionType = "Edit",
                    DataType = "VisioMap",
                    RefId = visiomap.Id,
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ChangeData = objJson.ToString()
                };

                db.Add(log);
            }

            db.SaveChanges();
        }

        public async Task<JArray> ChangeRelationType(string type, string changeType, int? id)
        {
            JArray arrGroup = new JArray();

            if (type == "InnComponent" || type == "InnProperty")
            {
                if (id == null)
                    return arrGroup;

                //Product product = db.Products.Find(id);
                Product product = await db.Products
                    .Include(e => e.Children)
                        .ThenInclude(e => e.Code)
                    .Include(e => e.Children)
                        .ThenInclude(e => e.Product)
                    .FirstOrDefaultAsync(e => e.Id == id);

                foreach (var group in product.Children.GroupBy(e => e.Code))
                {
                    JObject obGroup = new JObject();
                    arrGroup.Add(obGroup);

                    obGroup.Add("Group", group.First().Code.Name);


                    JArray arrVariants = new JArray();
                    obGroup.Add("Variants", arrVariants);

                    foreach (Variant variant in group.OrderBy(e => e.Priority))
                    {
                        JObject obVariant = new JObject();
                        arrVariants.Add(obVariant);

                        obVariant.Add("Id", variant.Id);
                        obVariant.Add("Model", variant.Product.Model);
                        obVariant.Add("Name", variant.ComponentName);
                    }
                }
            }
            else if (type == "InnLayer")
            {
                if (id == null)
                    return arrGroup;

                var visiomaps = db.VisioMaps
                    .Include(e => e.WordMap)
                    .Where(e => e.ProductId == id);

                foreach (VisioMap visiomap in visiomaps)
                {
                    JObject obVisiomap = new JObject();
                    arrGroup.Add(obVisiomap);

                    obVisiomap.Add("Id", visiomap.Id);
                    obVisiomap.Add("Name", visiomap.Title);
                    obVisiomap.Add("File", visiomap.WordMap.Object);
                }
            }
            else if (type == "IntComponent" || type == "IntLayer")
            {
                if (changeType == "ReType")
                {
                    foreach (Equipment equipment in db.Equipments)
                    {
                        JObject obEquipment = new JObject();
                        arrGroup.Add(obEquipment);

                        obEquipment.Add("Id", equipment.Id);
                        obEquipment.Add("Name", equipment.Name);
                    }
                }
                else if (changeType == "ReEquip")
                {
                    if (id == null)
                        return arrGroup;

                    var products = db.Products.Where(e => e.EquipmentId == id);

                    foreach (Product product in products)
                    {
                        JObject obProduct = new JObject();
                        arrGroup.Add(obProduct);

                        obProduct.Add("Id", product.Id);
                        obProduct.Add("Model", product.Model);
                    }
                }
                else if (changeType == "RePro")
                {
                    if (id == null)
                        return arrGroup;

                    if (type == "IntComponent")
                    {
                        var components = db.Variants
                        .Include(e => e.Product)
                        .Where(e => e.ParentId == id);

                        foreach (Variant variant in components)
                        {
                            JObject obVariant = new JObject();
                            arrGroup.Add(obVariant);

                            obVariant.Add("Id", variant.Id);
                            obVariant.Add("Model", variant.Product.Model);
                            obVariant.Add("Name", variant.ComponentName);
                        }
                    }
                    else if (type == "IntLayer")
                    {
                        var visiomaps = db.VisioMaps.Where(e => e.ProductId == id);

                        foreach (VisioMap visiomap in visiomaps)
                        {
                            JObject obVisiomap = new JObject();
                            arrGroup.Add(obVisiomap);

                            obVisiomap.Add("Id", visiomap.Id);
                            obVisiomap.Add("Name", visiomap.Title);
                        }
                    }
                }
                else if (changeType == "ReVariant")
                {
                    if (id == null)
                        return arrGroup;

                    var visiomaps = db.VisioMaps.Where(e => e.ProductId == id);

                    foreach (VisioMap visiomap in visiomaps)
                    {
                        JObject obVisiomap = new JObject();
                        arrGroup.Add(obVisiomap);

                        obVisiomap.Add("Id", visiomap.Id);
                        obVisiomap.Add("Name", visiomap.Title);
                    }
                }
            }


            return arrGroup;
        }

        public async void CopyVisiomaps(string json)
        {
            foreach (int visioId in JArray.Parse(json))
            {
                VisioMap oVisiomap = await db.VisioMaps
                    .Include(e => e.Shapes)
                        .ThenInclude(e => e.RelationShapes)
                    .Include(e => e.Relations)
                    .FirstOrDefaultAsync(e => e.Id == visioId);

                VisioMap nVisiomap = new VisioMap();

                nVisiomap = (VisioMap)db.Entry(oVisiomap).GetDatabaseValues().ToObject();
                nVisiomap.Date = DateTime.Now;
                nVisiomap.User = User.Identity.Name;

                db.Add(nVisiomap);
                db.SaveChanges();


                foreach (Shape oShape in oVisiomap.Shapes)
                {
                    Shape newShape = new Shape();
                    newShape = (Shape)db.Entry(oShape).GetDatabaseValues().ToObject();
                    newShape.Date = DateTime.Now;
                    newShape.User = User.Identity.Name;
                    nVisiomap.Shapes.Add(newShape);

                    foreach (RelationShape oReShape in oShape.RelationShapes)
                    {
                        RelationShape newReShape = new RelationShape();
                        newReShape = (RelationShape)db.Entry(oReShape).GetDatabaseValues().ToObject();
                        newShape.RelationShapes.Add(newReShape);
                    }
                }

                db.SaveChanges();


                // Relation
                foreach (RelationVisiomap oReVisio in oVisiomap.Relations)
                {
                    RelationVisiomap newReVisio = new RelationVisiomap();
                    newReVisio = (RelationVisiomap)db.Entry(oReVisio).GetDatabaseValues().ToObject();
                    nVisiomap.Relations.Add(newReVisio);
                }

                db.SaveChanges();
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
