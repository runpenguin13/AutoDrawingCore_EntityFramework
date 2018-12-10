using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using AutoDrawing.Models.DrawingDemo;
using AutoDrawing.Models.KJERPX;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json.Linq;

namespace AutoDrawing.Controllers
{
    [Authorize]
    public class WordMapsController : Controller
    {
        private readonly DrawingDemoContext db;
        private readonly KJERPXContext db2;

        public WordMapsController(DrawingDemoContext context, KJERPXContext context2)
        {
            db = context;
            db2 = context2;
        }

        // GET: WordMaps
        public IActionResult Index()
        {
            return View();
        }

        public async Task<JArray> LoadWordMaps(string filter, string category)
        {
            if (!string.IsNullOrEmpty(category))
            {
                if (category.ToUpper() == "ALL" || category.ToUpper() == "CATEGORY")
                    category = "";
                else if (category.ToUpper() == "BOOKMARKS")
                    category = "DELETE";
                else if (category.ToUpper() == "CONTENTCONTROL")
                    category = "UPDATE";
            }

            IEnumerable<WordMap> wordmaps = db.WordMaps
                .Include(e => e.Product)
                .AsNoTracking()
                .Where(e => e.ElementType.Contains(category??"") && (e.Product.Model.Contains(filter??"") || e.ElementName.Contains(filter??"")))
                .OrderBy(e => e.Id);

            if (string.IsNullOrEmpty(filter))
            {
                int x = wordmaps.Count() - 100;

                if (x > 0)
                    wordmaps = wordmaps.Skip(x);
            }

            JArray arrWordMaps = new JArray();

            foreach (var wordMap in wordmaps)
            {
                JObject item = new JObject();

                item.Add("WordMapId", wordMap.Id);
                item.Add("ProductId", wordMap.ProductId);
                item.Add("ProductNumber", wordMap.Product.Model);
                item.Add("ElementName", wordMap.ElementName);
                item.Add("ElementType", wordMap.ElementType);

                if (!string.IsNullOrEmpty(wordMap.VariantIds))
                {
                    List<string> arrVariantIds = wordMap.VariantIds.Split(',').ToList();
                    string strVariant = null;
                    bool check = false;


                    for (int i = arrVariantIds.Count - 1; i >= 0; i--)
                    {
                        int variantId = int.Parse(arrVariantIds[i]);
                        Variant variant = await db.Variants
                            .Include(e => e.Product)
                            .FirstOrDefaultAsync(e => e.Id == variantId);

                        if (variant == null)
                        {
                            arrVariantIds.RemoveAt(i);
                            check = true;
                        }
                        else
                            strVariant += strVariant == null ? variant.Product.Model : "," + variant.Product.Model;
                    }

                    if (check)
                    {
                        wordMap.VariantIds = string.Join(",", arrVariantIds);
                        db.Update(wordmaps);
                    }
                }

                arrWordMaps.Add(item);
            }

            db.SaveChanges();

            return arrWordMaps;
        }

        public void Create(WordMap wordmap, string variants)
        {
            wordmap.ComponentGroup = string.IsNullOrEmpty(wordmap.ComponentGroup) ? null : wordmap.ComponentGroup.Trim();
            wordmap.Mass = string.IsNullOrEmpty(wordmap.Mass) ? null : wordmap.Mass.Trim();
            wordmap.ElementName = string.IsNullOrEmpty(wordmap.ElementName) ? null : wordmap.ElementName.Trim();
            wordmap.ElementType = string.IsNullOrEmpty(wordmap.ElementType) ? null : wordmap.ElementType.Trim();
            wordmap.Object = string.IsNullOrEmpty(wordmap.Object) ? null : wordmap.Object.Trim();
            wordmap.Desc = string.IsNullOrEmpty(wordmap.Desc) ? null : wordmap.Desc.Trim();
            wordmap.Method = string.IsNullOrEmpty(wordmap.Method) ? null : wordmap.Method.Trim();
            wordmap.Value = string.IsNullOrEmpty(wordmap.Value) ? null : wordmap.Value.Trim();
            wordmap.VariantIds = string.IsNullOrEmpty(wordmap.VariantIds) ? null : wordmap.VariantIds.Trim();

            wordmap.Date = DateTime.Now;
            wordmap.User = User.Identity.Name;

            db.Add(wordmap);
            db.SaveChanges();
        }

        public void Edit(int id, int productId, string componentGroup, string mass, int? quantity, string elementName, string elementType,
            string obj, string desc, string method, string value, string variants)
        {
            WordMap wordmap = db.WordMaps.Find(id);

            JArray arrWordMap = new JArray();
            bool change = false;


            if (wordmap.ProductId != productId)
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "ProductId");
                objWordMap.Add("oValue", wordmap.ProductId);
                objWordMap.Add("nValue", productId);
                arrWordMap.Add(objWordMap);

                wordmap.ProductId = productId;
                change = true;
            }
            if (wordmap.ComponentGroup != (componentGroup = string.IsNullOrEmpty(componentGroup) ? null : componentGroup.Trim()))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "ComponentGroup");
                objWordMap.Add("oValue", wordmap.ComponentGroup);
                objWordMap.Add("nValue", componentGroup);
                arrWordMap.Add(objWordMap);

                wordmap.ComponentGroup = componentGroup;
                change = true;
            }
            if (wordmap.Mass != (mass = string.IsNullOrEmpty(mass) ? null : mass))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "Mass");
                objWordMap.Add("oValue", wordmap.Mass);
                objWordMap.Add("nValue", mass);
                arrWordMap.Add(objWordMap);

                wordmap.Mass = mass;
                change = true;
            }
            if (wordmap.Quantity != quantity)
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "Quantity");
                objWordMap.Add("oValue", wordmap.Quantity);
                objWordMap.Add("nValue", quantity);
                arrWordMap.Add(objWordMap);

                wordmap.Quantity = quantity;
                change = true;
            }
            if (wordmap.ElementName != (elementName = string.IsNullOrEmpty(elementName) ? null : elementName.Trim()))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "ElementName");
                objWordMap.Add("oValue", wordmap.ElementName);
                objWordMap.Add("nValue", elementName);
                arrWordMap.Add(objWordMap);

                wordmap.ElementName = elementName;
                change = true;
            }
            if (wordmap.ElementType != (elementType = string.IsNullOrEmpty(elementType) ? null : elementType.Trim()))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "ElementType");
                objWordMap.Add("oValue", wordmap.ElementType);
                objWordMap.Add("nValue", elementType);
                arrWordMap.Add(objWordMap);

                wordmap.ElementType = elementType;
                change = true;
            }
            if (wordmap.Object != (obj = string.IsNullOrEmpty(obj) ? null : obj.Trim()))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "Object");
                objWordMap.Add("oValue", wordmap.Object);
                objWordMap.Add("nValue", obj);
                arrWordMap.Add(objWordMap);

                wordmap.Object = obj;
                change = true;
            }
            if (wordmap.Desc != (desc = string.IsNullOrEmpty(desc) ? null : desc.Trim()))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "Desc");
                objWordMap.Add("oValue", wordmap.Desc);
                objWordMap.Add("nValue", desc);
                arrWordMap.Add(objWordMap);

                wordmap.Desc = desc;
                change = true;
            }
            if (wordmap.Method != (method = string.IsNullOrEmpty(method) ? null : method.Trim()))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "Method");
                objWordMap.Add("oValue", wordmap.Method);
                objWordMap.Add("nValue", method);
                arrWordMap.Add(objWordMap);

                wordmap.Method = method;
                change = true;
            }
            if (wordmap.Value != (value = string.IsNullOrEmpty(value) ? null : value.Trim()))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "Value");
                objWordMap.Add("oValue", wordmap.Value);
                objWordMap.Add("nValue", value);
                arrWordMap.Add(objWordMap);

                wordmap.Value = value;
                change = true;
            }
            if (wordmap.VariantIds != (variants = string.IsNullOrEmpty(variants) ? null : variants.Trim()))
            {
                JObject objWordMap = new JObject();
                objWordMap.Add("Type", "VariantIds");
                objWordMap.Add("oValue", wordmap.VariantIds);
                objWordMap.Add("nValue", variants);
                arrWordMap.Add(objWordMap);

                wordmap.VariantIds = variants;
                change = true;
            }

            if (change)
            {
                Log log = new Log
                {
                    ActionType = "Edit",
                    DataType = "WordMap",
                    RefId = wordmap.Id,
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ChangeData = arrWordMap.ToString()
                };
                db.Add(log);
                db.Update(wordmap);
                db.SaveChanges();
            }
        }

        public JArray LoadProductList()
        {
            JArray arrProduct = new JArray();

            var products = db.Products
                .Include(e => e.Equipment)
                .Where(e => e.Completion.Contains("GOODS"));

            foreach (var product in products)
            {
                JObject item = new JObject();

                item.Add("ProductId", product.Id);
                item.Add("ProductModel", product.Model);
                item.Add("EquipmentName", product.Equipment.Name);

                arrProduct.Add(item);
            }

            return arrProduct;
        }

        public async Task<JArray> LoadVariantList(int productId)
        {
            Product product = await db.Products
                .Include(e => e.Children)
                    .ThenInclude(e => e.Code)
                .Include(e => e.Children)
                    .ThenInclude(e => e.Product)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == productId);

            JArray arrGroup = new JArray();

            foreach (var group in product.Children.GroupBy(g => g.VariantGroup))
            {
                JObject obGroup = new JObject();
                arrGroup.Add(obGroup);

                JArray arrVariant = new JArray();
                obGroup.Add("Group", group.First().Code.Name);
                obGroup.Add("Variants", arrVariant);

                foreach (Variant variant in group.OrderBy(o => o.Priority))
                {
                    JObject obVariant = new JObject();
                    arrVariant.Add(obVariant);

                    obVariant.Add("VariantId", variant.Id);
                    obVariant.Add("VariantModel", variant.Product.Model);
                    obVariant.Add("VariantName", variant.ComponentName);
                    obVariant.Add("VariantRemark", variant.Remark);
                    obVariant.Add("VariantGroup", variant.Code.Name);
                }
            }

            return arrGroup;
        }


        public async Task<JObject> ChangeProduct(int? productId)
        {
            JObject objJson = new JObject();

            if (productId == null)
                return objJson;

            //var product = db.Products.Find(productId);
            Product product = await db.Products
                .Include(e => e.Equipment)
                .Include(e => e.Children)
                    .ThenInclude(e => e.Code)
                .Include(e => e.Children)
                    .ThenInclude(e => e.Product)
                .FirstOrDefaultAsync(e => e.Id == productId);

            JArray arrGroup = new JArray();

            foreach (var group in product.Children.GroupBy(g => g.Code))
            {
                JArray arrVariant = new JArray();

                foreach (var variant in group.OrderBy(o => o.Priority))
                {
                    JObject obVariant = new JObject();

                    obVariant.Add("VariantId", variant.Id);
                    obVariant.Add("VariantModel", variant.Product.Model);
                    obVariant.Add("VariantName", variant.ComponentName);
                    obVariant.Add("VariantRemark", variant.Remark);

                    arrVariant.Add(obVariant);
                }

                JObject obGroup = new JObject();
                obGroup.Add("Group", group.First().Code.Name);
                obGroup.Add("Variants", arrVariant);

                arrGroup.Add(obGroup);
            }

            objJson.Add("EquipmentGroup", product.Equipment.Name);
            objJson.Add("Variants", arrGroup);

            return objJson;
        }

        public void SubmitDelete(string json)
        {
            foreach (int id in JArray.Parse(json))
            {
                WordMap wordmap = db.WordMaps.Find(id);

                Log log = new Log
                {
                    ActionType = "Delete",
                    DataType = "WordMap",
                    RefId = wordmap.Id,
                    Date = DateTime.Now,
                    User = User.Identity.Name,
                    ChangeData = new JObject { { "ElementName", wordmap.ElementName } }.ToString()
                };

                db.Add(log);
                db.Remove(wordmap);
            }

            db.SaveChanges();
        }

        public async Task<JObject> LoadWordMapItem(int id)
        {
            WordMap wordmap = await db.WordMaps
                .Include(e => e.Product)
                    .ThenInclude(e => e.Equipment)
                .FirstOrDefaultAsync(e => e.Id == id);

            JObject selectItem = new JObject();

            selectItem.Add("Id", wordmap.Id);
            selectItem.Add("EquipmentName", wordmap.Product.Equipment.Name);
            selectItem.Add("ProductId", wordmap.ProductId);
            selectItem.Add("ComponentGroup", wordmap.ComponentGroup);
            selectItem.Add("ComponentPart", wordmap.ComponentPart);
            selectItem.Add("Mass", wordmap.Mass);
            selectItem.Add("Quantity", wordmap.Quantity);
            selectItem.Add("ElementName", wordmap.ElementName);
            selectItem.Add("ElementType", wordmap.ElementType);
            selectItem.Add("Obj", wordmap.Object);
            selectItem.Add("Desc", wordmap.Desc);
            selectItem.Add("Method", wordmap.Method);
            selectItem.Add("Value", wordmap.Value);
            selectItem.Add("VariantIds", wordmap.VariantIds);

            return selectItem;
        }

        public void Clone(int? id)
        {
            WordMap oWordmap = db.WordMaps.Find(id);
            WordMap nWordmap = new WordMap();

            nWordmap = (WordMap)db.Entry(oWordmap).GetDatabaseValues().ToObject();
            nWordmap.Date = DateTime.Now;
            nWordmap.User = User.Identity.Name;

            db.Add(nWordmap);
            db.SaveChanges();
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
