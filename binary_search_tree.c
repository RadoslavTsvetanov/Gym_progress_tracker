#include <stdlib.h>
#include <stdio.h>

typedef struct Node
{
    int val;
    struct Node *left;
    struct Node *right;
} Node;

Node *create_node(int val)
{
    Node *new_node = (Node *)malloc(sizeof(Node));
    new_node->val = val;
    new_node->left = NULL;
    new_node->right = NULL;
    return new_node;
}

void add_child(Node *parent_node, Node *new_node)
{
    if (parent_node->left == NULL && parent_node->right == NULL)
    {
        if (new_node->val <= parent_node->val)
        {
            parent_node->left = new_node;
        }
        else
        {
            parent_node->right = new_node;
        }
    }

    if (new_node->val <= parent_node->val)
    {
        add_child(parent_node->left, new_node);
    }
    else
    {
        add_child(parent_node->right, new_node);
    }
}

typedef struct Tree
{
    Node *root;
} Tree;

Tree *create_tree(Node *node)
{

    Tree *new_tree = (Tree *)malloc(sizeof(Tree));
    return new_tree;
}
void print_branch(Node *node)
{
    printf("%d", node->val);
    if (node->left == NULL && node->right == NULL)
    {
        printf("&d", node->val);
        return;
    }
    else
    {
        print_branch(node->left);
        print_branch(node->right);
    }
}
void print_tree(Tree *tree)
{
    print_branch(tree->root);
}

int main()
{
    int arr[] = {0, 1, 2, 3, 4, 5, 6, 7};
    Tree *tree = create_tree(create_node(5));
    for (int i = 0; i < sizeof(arr) / sizeof(arr[0]); i++)
    {
        add_child(tree->root, create_node(arr[i]));
    }
    print_tree(tree);

    return 0;
}