using System;
using System.Collections.Generic;

namespace AutoDrawing.Models.DrawingDemo
{
    public partial class Log
    {
        public int Id { get; set; }
        public string ActionType { get; set; }
        public int? RefId { get; set; }
        public string DataType { get; set; }
        public DateTime? Date { get; set; }
        public string User { get; set; }
        public string ChangeData { get; set; }
    }
}
