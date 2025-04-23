using LinkedList;
using My.Stk;
using System;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace StackPrj
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Stack<int> stk = new Stack<int>();
            stk.Push(1);
            stk.Push(2);
            stk.Push(3);
            stk.Push(4);

            Stack<int> stk2 = DuplicateStack(stk);
            Console.WriteLine(stk);
            Console.WriteLine(stk2);
            Console.WriteLine(SumStackLoop(stk));
            Console.WriteLine(stk);
            Console.WriteLine(SumStackRec(stk));
            Console.WriteLine(stk);
            Console.ReadLine();
        }

        private static int SumStackLoop(Stack<int> stk)
        {
            int sum = 0;
            Stack<int> bis = DuplicateStack(stk);
            while (!bis.IsEmpty())
            {
                sum += bis.Pop();
            }
            return sum;
        }

        public static int GetNumOfItems<T>(Stack<T> stk)
        {
            int counter = 0;
            Stack<T> temp = new Stack<T>();

            while (!stk.IsEmpty())
            {
                counter++;
                temp.Push(stk.Pop());
            }

            //restore stk
            while (!temp.IsEmpty())
            {
                stk.Push(temp.Pop());
            }

            return counter;
        }

        public static Stack<T> DuplicateStack<T>(Stack<T> stk)
        {
            Stack<T> copyStack = new Stack<T>();
            if(stk.IsEmpty()) 
                return copyStack;
            Stack<T> reversedStack = new Stack<T>();
            while (!stk.IsEmpty())
                reversedStack.Push(stk.Pop());
            while (!reversedStack.IsEmpty())
            {
                T temp = reversedStack.Pop();
                stk.Push(temp);
                copyStack.Push(temp);
            }
            return copyStack;
        }

        public static int SumStackRec(Stack<int> stack)
        {
            if (stack.IsEmpty())
                return 0;

            int top = stack.Pop();
            int sum = top + SumStackRec(stack);
            stack.Push(top); 
            return sum;
        }
        public static bool IsPalindrome(string str)
        {
            Stack<char> stack = new Stack<char>();
            foreach (char c in str)
            {
                stack.Push(c);
            }
            foreach (char c in str)
            {
                if (c != stack.Pop())
                {
                    return false;
                }
            }
            return true;
        }

    }
}
