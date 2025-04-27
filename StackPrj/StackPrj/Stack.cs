using LinkedList;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace My.Stk
{
    internal class Stack<T>
    {
        private Node<T> head;

        public Stack()
        {
            head = null;
        }

        public bool IsEmpty()
        {
            return head == null;
        }

        public void Push(T x)
        {
            head = new Node<T>(x, head);
        }

        public T Top()
        {
            return head.GetValue();
        }

        public T Pop()
        {
            T value = head.GetValue();
            head = head.GetNext();
            return value;
        }

        public override string ToString()
        {
            if (IsEmpty())
            {
                return "[]";
            }

            string str = "[";
            Node<T> temp = head;
            while (temp != null)
            {
                str += temp.GetValue() + ",";
                temp = temp.GetNext();
            }
            str = str.Substring(0, str.Length - 1) + "]";

            return str;
        }

        public int GetNumOfItems()
        {
            int counter = 0;
            Node<T> temp = head;

            while (temp != null)
            {
                counter++;
                temp = temp.GetNext();
            }

            return counter;
        }
    }
}
