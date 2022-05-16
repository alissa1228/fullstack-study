//다른 컴포넌트에 재사용할 스타일 적용하는데 사용.

const Container = ({children}) => {
    return(
        <div style={styles.container}>
            {children}
        </div>
    )

}

export default Container;

const styles = {
    container : {
        margin: '0 auto',
        padding:'50px 100px'
    }
}